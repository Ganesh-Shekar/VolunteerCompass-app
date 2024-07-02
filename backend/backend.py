from flask import Flask, jsonify, request
import json
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
import bcrypt as bc
from supabase import create_client
import string
import constant as const
import uuid
from datetime import timedelta, datetime, timezone
import traceback

from flask_jwt_extended import create_access_token
from flask_jwt_extended import create_refresh_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import get_jwt
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

# Pass word for python anywhere: VolunteerCompass123

# create supabase client
supabase = create_client(
    "https://cbmaosiqqzptjtdexbtx.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibWFvc2lxcXpwdGp0ZGV4YnR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTQxMTA4MSwiZXhwIjoyMDE2OTg3MDgxfQ.0qt2L2LY2_IxkDrrYFUj65fHIEADMNt_nBzmXCXwQGc",
)

# create server
app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

#ACCESS_EXPIRES= timedelta(hours=1)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=7)
app.config["JWT_SECRET_KEY"]= "046b44d6dc978945a75a13d9"
jwt=JWTManager(app)

#jwt error handlers

@jwt.expired_token_loader  
def expired_token_callback(jwt_header, jwt_data):
    return jsonify({
        "message": "The token has expired",
        "error": "token_expired"}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({
        "message": "Signature verification failed",
        "error": "invalid_token"}), 401
    
@jwt.unauthorized_loader   
def missing_token_callback(error):
    return jsonify({
        "message": "Request does not contain an access token",
        "error": "authorization_required"}), 401



#to check if the token has been blocklisted
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_data):
    jti = jwt_data["jti"]
    try:
        # Query the blocklist table for the token jti
        response = supabase.table("TokenBlocklist").select("jti").eq("jti", jti).execute()
        token = response.data
    except Exception as e:
        print(f"Error querying TokenBlocklist: {e}")
        return True  # If there's an error, assume the token is revoked

    # If token is found in the blocklist, it means it has been revoked
    return len(token) > 0


# name fixing function: education -> Education, animal_shelter -> Animal Shelter
def rename(name, option):
    if option == 1:
        newname = string.capwords(name.replace("_", " "))
    else:
        newname = name.replace(" ", "_").lower()
    return newname


@app.route("/")
def default():
    return "Server is running"


# sign up user API
@app.route("/signup-user", methods=["POST"])
@cross_origin()
def signUpUser():
    data = request.get_json()
    data["user_id"] = str(uuid.uuid4())
    password = data["password"]

    hashed = bc.hashpw(password.encode("utf-8"), bc.gensalt(12)).decode("utf-8")
    
    data["password"] = hashed

    supabase.table("user_details").insert(data).execute()

    return const.successMessage200


salt = bc.gensalt()


# sign up NGO API
@app.route("/signup-ngo", methods=["POST"])
@cross_origin()
def signUpNgo():
    data = request.get_json()
    ngo_user_name = data["ngo_display_name"]
    data["ngo_user_name"] = rename(ngo_user_name, 2)

    password = data["password"]

    hashed = bc.hashpw(password.encode("utf-8"), bc.gensalt(12)).decode("utf-8")
    data["password"] = hashed

    category = data["category"]
    category = category.lower().replace(' ', '_')
    categoryId = (
        supabase.table("categories")
        .select("category_id")
        .eq("name", category)
        .execute()
    )
    data["category_id"] = categoryId.data[0].get("category_id")
    
   
    supabase.table("ngo_details").insert(data).execute()

    return const.successMessage200


# log in API
@app.route("/login", methods=["GET"])
@cross_origin()
def logIn():
    email = request.args.get("email")
    password = request.args.get("password")
    
    response = {}

    ngo_result = (
        supabase.table("ngo_details").select("*").eq("contact_email", email).execute()
    )

    if not ngo_result.data:
        user_result = (
            supabase.table("user_details")
            .select("*")
            .eq("contact_email", email)
            .execute()
        )
        
        user_id = user_result.data[0]['user_id']
        
        if not user_result.data:
            response = {"statusCode": 102, "message": "User Not Found", "data": {}}
            return jsonify(response)
        user_result.data[0]["type"] = "user"

        result = user_result

    else:
        ngo_result.data[0]["type"] = "ngo"
        user_id = ngo_result.data[0]["ngo_id"]
        result = ngo_result

    password_data = result.data[0]["password"] if result.data else None
    password_str = str(password_data) if password_data else None

    if password_str and bc.checkpw(
        password.encode("utf-8"), password_str.encode("utf-8")
    ):
        accesstoken=create_access_token(identity=user_id)
        refreshtoken=create_refresh_token(identity=user_id)
        response = {
            "statusCode": 200,
            "message": "Logged in successfully",
            "tokens":{"accesstoken": accesstoken, 
                       "refreshtoken": refreshtoken},
            "data": result.data[0],
        }
        return jsonify(response)
    else:
        response = {"statusCode": 101, "message": "Password Incorrect", "data": {}}
        return jsonify(response)


# getting data for the categories: image to display, name of category
@app.route("/getCategories", methods=["GET"])
@cross_origin()
def getCategories():
    
    response = supabase.table("categories").select("*").execute()
    data = response.data
    
    for object in data:
        name = rename(object["name"], 1)
        key = "horizontalScrollable/" + object["name"] + ".png"

        public_url = supabase.storage.from_("imageBucket").get_public_url(key)
        object["name"] = name
        object["url"] = public_url
    return jsonify(data), 200   


# HAVE TO WORK ON CHECKING WHETHER IMAGE EXISTS TO CREATE URL

#to check whether the user is registered for an event or not
@app.route("/checkUserRegistration", methods=["POST"])
@cross_origin()
@jwt_required()
def checkUserRegistration():
    current_user = get_jwt_identity()
    user_details_response = supabase.table("user_details").select("*").eq("user_id", current_user).execute()
    ngo_details_response = supabase.table("ngo_details").select("*").eq("ngo_id", current_user).execute()
    user_details = user_details_response.data 
    ngo_details= ngo_details_response.data

    if (user_details or ngo_details):
        data =request.get_json()
        get_user_id= user_details[0]["user_id"]
        user_id = get_user_id
        ngo_id = data["ngo_id"]
        event_id = data["event_id"]
        if user_id and ngo_id and event_id:
            response = supabase.table("event_volunteers").select("*").eq("user_id", user_id).eq("ngo_id", ngo_id).eq("event_id", event_id).execute()
            if response.data == []:
                return jsonify({"registered": False})
            else:
                return jsonify({"registered": True})
        else:
            return jsonify({"registered": False})
    return const.errorMessage105
        


# getting all the NGOs under a category (used in Home screen todisplay as horizontal list)
@app.route("/category", methods=["GET"])
@jwt_required()
@cross_origin()
def get_category():
    
    current_user=get_jwt_identity()
     # Get user details for the current user
    user_details_response = supabase.table("user_details").select("*").eq("user_id", current_user).execute()
    ngo_details_response = supabase.table("ngo_details").select("*").eq("ngo_id", current_user).execute()
    user_details = user_details_response.data 
    ngo_details= ngo_details_response.data
    
    if user_details or ngo_details:
        categoryId = request.args.get("categoryId")

    if categoryId:
        response = (
            supabase.table("ngo_details")
            .select(
                "ngo_id",
                "category_id",
                "ngo_display_name",
                "created_at",
                "address",
                "city",
                "event_count"
            )
            .eq("category_id", categoryId)
            .execute()
        )
    else:
        response = supabase.table("ngo_details").select("*").execute()
    data = response.data
    return jsonify(data)


# HAVE TO WORK ON SECURITY FOR ABOVE CODE


# getting ngo info
@app.route("/ngo", methods=["GET"])
@jwt_required()
@cross_origin()
def get_ngo():
    
    current_user=get_jwt_identity()
    # Get user details for the current user
    user_details_response = supabase.table("user_details").select("*").eq("user_id", current_user).execute()
    ngo_details_response = supabase.table("ngo_details").select("*").eq("ngo_id", current_user).execute()
    user_details = user_details_response.data 
    ngo_details= ngo_details_response.data

    if (user_details or ngo_details):
        ngoId = request.args.get("ngoId")

        if ngoId:
            response = (
                supabase.table("ngo_details")
                .select(
                    "id",
                    "active_years",
                    "address",
                    "contact_email",
                    "contact_phone",
                    "description",
                    "founding_year",
                    "ngo_display_name",
                    "working_hours",
                    "category",
                )
                .eq("ngo_id", ngoId)
                .execute()
            )

            data = response.data
            # data["category"] = rename(data[0]["category"], 1)
            return jsonify(data), const.success200
        else:
            return const.errorMessage104


# get user details from userId
@app.route("/userdetails")
@cross_origin()
def user_details():
    userId = request.args.get("user_id")

    if userId:
        response = (
            supabase.table("user_details")
            .select(
                "user_id",
                "first_name",
                "last_name",
                "contact_email",
            )
            .eq("user_id", userId)
            .execute()
        )
        data = response.data
        return jsonify(data)
    else:
        return const.errorMessage105


# get all ngos that user has volunteered to
@app.route("/userVolunteered", methods=["GET"])
@cross_origin()
@jwt_required()
def userVolunteered():
    current_user=get_jwt_identity()
     # Get user details for the current user
    user_details_response = supabase.table("user_details").select("*").eq("user_id", current_user).execute()
    ngo_details_response = supabase.table("ngo_details").select("*").eq("ngo_id", current_user).execute()
    user_details = user_details_response.data 
    ngo_details= ngo_details_response.data

    if (user_details or ngo_details):
        userId = request.args.get("user_id")

        if userId:
            data = []
            response = (
                supabase.table("volunteer_details")
                .select("ngo_id")
                .eq("user_id", userId)
                .execute()
            )
            ngoIds = response.data

            if ngoIds:
                for i in ngoIds:
                    response = (
                        supabase.table("ngo_details")
                        .select("ngo_display_name")
                        .eq("ngo_id", i["ngo_id"])
                        .execute()
                    ).data
                    data.append(response)
                return jsonify(data)
            else:
                return const.errorMessage106
        else:
            return const.errorMessage105


# fetch all users that have volunteered to an Ngo
@app.route("/ngoVolunteered", methods=["GET"])
@cross_origin()
@jwt_required()
def ngoVolunteered():
    current_user=get_jwt_identity()
     # Get user details for the current user
    user_details_response = supabase.table("user_details").select("*").eq("user_id", current_user).execute()
    ngo_details_response = supabase.table("ngo_details").select("*").eq("ngo_id", current_user).execute()
    user_details = user_details_response.data 
    ngo_details= ngo_details_response.data

    if (user_details or ngo_details):
        ngoId = request.args.get("ngo_id")

        if ngoId:
            data = []
            response = (
                supabase.table("volunteer_details")
                .select("user_id")
                .eq("ngo_id", ngoId)
                .execute()
            )
            userIds = response.data

            if userIds:
                for i in userIds:
                    response = (
                        supabase.table("user_details")
                        .select("first_name", "last_name")
                        .eq("user_id", i["user_id"])
                        .execute()
                    ).data
                    data.append(response)
                return jsonify(data)
            else:
                return const.errorMessage106
        else:
            return const.errorMessage104


# add events into event_details table
@app.route("/add-event", methods=["POST"])
def addEvent():
    data = request.get_json()
    supabase.table("event_details").insert(data).execute()

    return const.successMessage200


# add volunteer to event table
@app.route("/volunteerEvent", methods=["POST"])
@cross_origin()
@jwt_required()
def addVolunteer():
    current_user=get_jwt_identity()
    user_details_response = supabase.table("user_details").select("*").eq("user_id", current_user).execute()
    userID= user_details_response.data[0]["user_id"]
    user_details = user_details_response.data
    
    if user_details:
        
        data = request.get_json()
        ngoId = data.get("ngo_id")
        userId = userID
        eventId = data.get("event_id")
        insert_data = {"user_id": userId, "ngo_id": ngoId, "event_id": eventId}
        supabase.table("event_volunteers").insert(insert_data).execute()

        return const.successMessage200

@app.route("/removeVolunteerEvent", methods=["POST"])
@cross_origin()
@jwt_required()
def removeVolunteer():
    current_user=get_jwt_identity()
    user_details_response = supabase.table("user_details").select("*").eq("user_id", current_user).execute()
    userID= user_details_response.data[0]["user_id"]
    ngo_details_response = supabase.table("ngo_details").select("*").eq("ngo_id", current_user).execute()
    user_details = user_details_response.data 
    ngo_details= ngo_details_response.data

    if (user_details or ngo_details):
        data = request.get_json()
        ngoId = data.get("ngo_id")
        userId = userID
        eventId = data.get("event_id")
        remove_data = {"user_id": userId, "ngo_id": ngoId, "event_id": eventId}
        supabase.table("event_volunteers").delete().match(remove_data).execute()

        return const.successMessage200


# get all volunteers volunteering for an event
@app.route("/getVounteers", methods=["GET"])
def getVolunteers():
    eventId = request.args.get("event_id")
    response = (
        supabase.table("event_volunteers")
        .select("user_id")
        .eq("event_id", eventId)
        .execute()
    ).data

    user_data = []

    for i in range(len(response)):
        user = (
            supabase.table("user_details")
            .select("first_name", "last_name", "contact_email", "age", "id")
            .eq("user_id", response[i]["user_id"])
            .execute()
        ).data
        user_data.append(user)
    return jsonify(user_data)


# get all events a user has volunteered for
@app.route("/eventsVolunteered", methods=["GET"])
@cross_origin()
@jwt_required()
def eventsVolunteered():
    current_user=get_jwt_identity()
     # Get user details of the current user
    user_details_response = supabase.table("user_details").select("*").eq("user_id", current_user).execute()
    ngo_details_response = supabase.table("ngo_details").select("*").eq("ngo_id", current_user).execute()
    user_details = user_details_response.data 
    ngo_details= ngo_details_response.data

    if (user_details or ngo_details):
        userId = request.args.get("user_id")
        response = (
            supabase.table("event_volunteers")
            .select("event_id")
            .eq("user_id", userId)
            .execute()
        ).data

        event_data = {}
        event_date = ""
        keys = ["id", "title", "description", "timing", "terms_of_working"]

        for i in range(len(response)):
            event = (
                supabase.table("event_details")
                .select("id", "title", "description", "timing", "terms_of_working", "date", "event_venue")
                .eq("event_id", response[i]["event_id"])
                .execute()
            ).data
            event_date = event[0]["date"]

            if event_date in event_data:
                event_data[event_date].append(
                    {
                        "name": event[0]["title"],
                        "description": event[0]["description"],
                        "timing": event[0]["timing"],
                        "event_venue": event[0]["event_venue"],
                    }
                )
            else:
                event_data[event_date] = [
                    {
                        "name": event[0]["title"],
                        "description": event[0]["description"],
                        "timing": event[0]["timing"],
                        "event_venue": event[0]["event_venue"],
                    }
                ]

        return jsonify(event_data)


# get all events for every ngo by ngo_id
@app.route("/getEvents", methods=["GET"])
@cross_origin()
@jwt_required()
def getEvents():
    current_user=get_jwt_identity()
     # Get user details for the current user
    user_details_response = supabase.table("user_details").select("*").eq("user_id", current_user).execute()
    ngo_details_response = supabase.table("ngo_details").select("*").eq("ngo_id", current_user).execute()
    user_details = user_details_response.data 
    ngo_details= ngo_details_response.data

    if (user_details or ngo_details):
        ngoId = request.args.get("ngo_id")
        response = (
            supabase.table("event_details")
            .select("id", "title", "description", "timing", "terms_of_working", "event_id", "event_venue", "event_requirements", "date")
            .eq("ngo_id", ngoId)
            .execute()
        ).data
        return jsonify(response)    
  

@app.route("/search", methods=["GET"])
@jwt_required()
def search():
    try:
        current_user=get_jwt_identity() 
        user_details_response = supabase.table("user_details").select("*").eq("user_id", current_user).execute()
        ngo_details_response = supabase.table("ngo_details").select("*").eq("ngo_id", current_user).execute()
        user_details = user_details_response.data 
        ngo_details= ngo_details_response.data

        if (user_details or ngo_details):
            query=request.args.get("query")
            response = (
                        supabase.table("ngo_details").select("ngo_id", "ngo_display_name", "category_id", "address").ilike("ngo_display_name", f"*{query}*").execute()
                    ).data
            response_data = response
            return jsonify(response_data)
    except Exception as e:
        return jsonify({"error": "An error occurred during the search", "details": str(e)}), 500
    # try:
            # query=request.args.get("query")
            # response = (
            #     supabase.table("ngo_details")
            #     .select("ngo_id", "ngo_display_name", "category_id")
            #     .ilike("ngo_display_name", f"%{query}%")
            #     .execute()
            # )
            
            # # Check if the response is successful
            # if response.error:
            #     return jsonify({"error": "Error from Supabase", "details": response.error.message}), 500

            # # Ensure the response data is valid JSON
            # response_data = response.data
            # if not response_data:
            #     return jsonify({"error": "No data found"}), 404

            # return jsonify(response_data)

    # except Exception as e:
    #     print("Traceback:", traceback.format_exc())  # This will print the traceback
    #     return jsonify({"error": "An error occurred during the search", "details": str(e)}), 500

#To refresh the access token upon expiration
@app.route("/refresh", methods=["POST"])
@cross_origin()
@jwt_required(refresh=True) 
def refresh():
    identity = get_jwt_identity()
    new_access_token = create_access_token(identity=identity)
    return jsonify(access_token=new_access_token), 200

# Endpoint for revoking the current users access token. Saved the unique
# identifier (jti) for the JWT into our database.
@app.route("/logout", methods=["DELETE"])
@cross_origin()
@jwt_required(verify_type=False)
def modify_token():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc).isoformat()
    try:
        supabase.table("TokenBlocklist").insert({"jti": jti, "created_at": now}).execute()
    except Exception as e:
        print(f"Error inserting data into TokenBlocklist: {e}")
    return jsonify(msg="JWT revoked"), 200


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
