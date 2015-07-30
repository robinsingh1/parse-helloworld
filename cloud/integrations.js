exports.google = {
  appData: function(code) {
    post_data = {   
      'code'          : code,
      'client_id'     : "27398137556-miucv0arep9daqpfc7hjqgu90tkr2e4v.apps.googleusercontent.com", 
      'client_secret' : "ioMM7E9UpP34dnm8CCpUn3ER", 
      'grant_type'    : 'authorization_code',
      'redirect_uri'  : 'http://app.customero.co/google_redirect'
    }         
  }
}

exports.outlook = {
  appData: function(code) {
    return {   
      'code'          :  code,
      'client_id'     : "000000004C152154",
      'client_secret' : "bsJO-IzXOu5nHUHXT3w-fcdg2WtaYets",
      'grant_type'    : 'authorization_code',
      'redirect_uri'  : 'http://app.customero.co/windows_redirect'
    }         
  }
}

exports.contextio = { 
  createAccount: function() {

  },
  newUser: function() {

  },
  contactImport: function() {

  }
}

exports.cronofy = { 
  initialEventImport: function(access_token) {

  },

  appData: function(code) {
    return {   
      'code'          : code,
      'client_id'     : "pALONoz-tMwY9PR72G7q615zJp1CODNk",
      'client_secret' : "wwru4XZjYqcgHszG1Q93pOC0cpmMWdjaICP4QLc2em2yDP0FBDsw4EBAgIecyRkXT3qioULyOgUC_cnO3xtTyg",
      'grant_type'    : 'authorization_code',
      'redirect_uri'  : 'http://app.customero.co/calendar_redirect'
    }         
  }
}

exports.salesforce = {
  appData: function(code) {
    return {   
      'code'          : code,
      'client_id'     : "3MVG9fMtCkV6eLhdURRwkpm7j9.Pxoo51QJfrtYBRZ1025HTvbG3WTpcU.oo2FF8DGtiOsT5Z1Y4ELWTVuV_l",
      'client_secret' : "6738220038464910638",
      'grant_type'    : 'authorization_code',
      'redirect_uri'  : 'https://prospector.parseapp.com/salesforce_redirect'
      //'redirect_uri'  : 'https://oauth.io/auth'
    }         
  },
  persistLead: function(res) {

  },
  persistActivity: function(data) {

  }
}

exports.persist = function(res, source, type, user_id) {
  // TODO - add user + user_company
  var User = Parse.Object.extend("_User");
  var query = new Parse.Query(User);
  query.get(user_id, {
    success: function(user) {
      console.log(user)
      var Integration = Parse.Object.extend("Integration");
      var integration = new Integration();
      data.source = source; 
      data.integration_type = type;
      data.user = { __type: "Pointer", className:"_User", objectId: user_id }
      data.user_company = user.user_company
      integration.save(data)
    },
    error: function(obj, err) {
      console.log(obj)
      console.log(err)
    }
  })
}
