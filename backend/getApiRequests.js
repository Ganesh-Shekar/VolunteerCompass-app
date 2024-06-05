import axios from 'axios';
import * as url from './constantUrl';

async function createRequestConfigInstance(mMethod, urlEndPoint, requestObj = null, params = {}){
  const config = {
    url: urlEndPoint,
    method: mMethod,
    responseType: 'json',
    headers:{
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning':'lmnop'
    }
  }

  if(mMethod == 'POST'){
    config.data = requestObj;
  }
  if(mMethod == 'GET'){
    config.params = params;
  }

  return config;
}


export const signUpNgo = async (data) => {
  return axios(await createRequestConfigInstance('POST', url.signupNgo, data))
  .then((response) => {
    if(response.status == 200)
      return response.data;
  })
  .catch((error) => {
    throw error
  })
}


export const signUpUser = async (data) => {
  return axios(await createRequestConfigInstance('POST', url.signupUser, data))
  .then((response) => {
    if(response.status == 200)
      return response.data;
  })
  .catch((error) => {
    throw error
  });
}


export const signIn = async (data) => {
  return axios(await createRequestConfigInstance('GET', url.login, null, data))
  .then((response) => {
    if(response.status == 200)
      return response.data;
  })
  .catch((error) => {
    throw error;
  })
}

export const getNgoBasedOnCategory = async (data) =>{
  return axios(await createRequestConfigInstance('GET',url.getNgoBasedOnCategoryId, null, data))
  .then(response => {
      if(response.status == 200){
        return response.data;
      }
  })
  .catch(error => {
     throw error;

  });
}

export const getAllCategories = async () =>{
  return axios(await createRequestConfigInstance('GET', url.getAllCategories))
  .then(response => {
      if(response.status ==200)
        return response.data;
  })
  .catch(error => {
     throw error;
  });
}

export const getNgoInfo = async (ngoId) =>{
  return axios(await createRequestConfigInstance('GET',url.getNgoDetailsBasedOnNgoId, null, {ngoId: ngoId}))
  .then(response => {
      if(response.status == 200)
        return response.data;
  })
  .catch(error => {
     throw error;

  });
}

export const addNgoEvent = async (data) => {
  return axios(await createRequestConfigInstance('POST', url.addEvent, data))
  .then(response => {
    if (response.status == 200)
      return response.data;
  })
  .catch(err => {
    throw err
  })
}

export const addVolunteerToEvent = async (userId, ngoId, eventId) => {
  return axios(await createRequestConfigInstance('POST', url.addVolunteer, null, {user_id:userId, ngo_id:ngoId, event_id:eventId}))
  .then(response => {
    if (response.status == 200)
      return response.data
  })
  .catch(err => {
    throw err
  })
} 

export const getAllVolunteersForEvent = async (eventId) => {
  return axios(await createRequestConfigInstance('GET', url.getVolunteerForEvent, null, {event_id: eventId}))
  .then(response => {
    if (response.status == 200)
      return response.data
  })
  .catch(err => {
    throw err
  })
}

export const getAllEventsVolunteeredByUser = async (userId) => {
  return axios(await createRequestConfigInstance('GET', url.getEventsForUser, null, {user_id: userId}))
  .then(response => {
    if (response.status == 200)
      return response.data
  })
  .catch(err => {
    throw err
  })
}

export const getAllEventsByNgoId = async (ngoId) => {
  return axios(await createRequestConfigInstance('GET', url.getAllEventsByNgoId, null, {ngo_id: ngoId}))
  .then(response => {
    if (response.status == 200)
      return response.data
  })
  .catch(err => {
    throw err
  })
}

export const getNgoNames = async (query) => {
  return axios(await createRequestConfigInstance('GET', url.getNgoNames, null, {query: query}))
  .then((response) => {
    if(response.status == 200)
      return response.data;
  })
  .catch((error) => {
    throw error;
  })
}