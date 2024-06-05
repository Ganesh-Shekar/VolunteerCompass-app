from flask import Flask, jsonify, request
import json
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
import bcrypt as bc
from supabase import create_client
import string
import constant as const

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

# token: RweE7vf1_oKSHUgew7URJTFehcrohqftATed5ATtY

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

# # Setup the Flask-JWT-Extended extension
# app.config["JWT_SECRET_KEY"] = (
#     "skjafndkjsfase8f0iji809ihy78oknjhu8i9okJHU890IojnhU89IOJN"
# )
# jwt = JWTManager(app)


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

    hashed = bc.hashpw(password.encode("utf-8"), salt).decode("utf-8")
    data["password"] = hashed

    category = data["category"]
    categoryId = (
        supabase.table("categories")
        .select("category_id")
        .eq("name", category)
        .execute()
    )

    data["category_id"] = categoryId
    supabase.table("ngo_details").insert(data).execute()

    return const.success200


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
        if not user_result.data:
            response = {"statusCode": 102, "message": "User Not Found", "data": {}}
            return jsonify(response)
        user_result.data[0]["type"] = "user"

        result = user_result

    else:
        ngo_result.data[0]["type"] = "ngo"
        result = ngo_result

    password_data = result.data[0]["password"] if result.data else None
    password_str = str(password_data) if password_data else None

    if password_str and bc.checkpw(
        password.encode("utf-8"), password_str.encode("utf-8")
    ):
        response = {
            "statusCode": 200,
            "message": "Logged in successfully",
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


# getting all the NGOs under a category
@app.route("/category", methods=["GET"])
@cross_origin()
def get_category():
    categoryId = request.args.get("categoryId")

    if categoryId:
        response = (
            supabase.table("ngo_details")
            .select(
                "ngo_id",
                "category_id",
                "ngo_display_name",
                "created_at",
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
@cross_origin()
def get_ngo():
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
                "terms_of_working",
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
def userVolunteered():
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
def ngoVolunteered():
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
def addVolunteer():
    ngoId = request.args.get("ngo_id")
    userId = request.args.get("user_id")
    eventId = request.args.get("event_id")
    data = {"user_id": userId, "ngo_id": ngoId, "event_id": eventId}
    supabase.table("event_volunteers").insert(data).execute()

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
def eventsVolunteered():
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
            .select("id", "title", "description", "timing", "terms_of_working", "date")
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
                }
            )
        else:
            event_data[event_date] = [
                {
                    "name": event[0]["title"],
                    "description": event[0]["description"],
                    "timing": event[0]["timing"],
                }
            ]

    return jsonify(event_data)


# get all events for every ngo by ngo_id
@app.route("/getEvents", methods=["GET"])
def getEvents():
    ngoId = request.args.get("ngo_id")
    response = (
        supabase.table("event_details")
        .select("id", "title", "description", "timings", "terms_of_working")
        .eq("ngo_id", ngoId)
        .execute()
    ).data
    return jsonify(response)


# # filter out items in db and return in json file format
# @app.route("/search")
# @cross_origin()
# def searchbar():
#     pass

@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("query")
    response = (
        supabase.table("ngo_details")
        .select("ngo_id", "ngo_display_name", "category_id")
        .ilike("ngo_display_name", f"%{query}%")
        .execute()
    ).data

    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)
