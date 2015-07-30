

require('cloud/app.js');
var Pusher = require('cloud/pusher.js')
var utf8 = require('cloud/utf8.js')
var Webhooks = require("cloud/webhooks.js")
var Integrations = require("cloud/integrations.js")
var salesforce = require("cloud/jsforce.js")
var Mailgun = require('mailgun');

// TODO - have a seperate webhook module - CloudElement, ContextIO, MailGun, Cronofy
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:

CLEARSPARK_URL = "http://floating-inlet-9798.herokuapp.com"
PROSPECTER_URL = "http://agile-ridge-9035.herokuapp.com"

Parse.Cloud.job('DailySignals', function(request, status) {
  Parse.Cloud.httpRequest({
    url: PROSPECTER_URL+'/v1/daily_signals',
    success: function(httpResponse) {
      console.success(httpResponse.text)
      //response.success();
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
    }
  });
});

Parse.Cloud.job('DailyNewsCron', function(request, status) {
  Parse.Cloud.httpRequest({
    url:CLEARSPARK_URL+'/v1/clearspark/daily_news_cron',
    success: function(httpResponse) {
      console.log(httpResponse.text)
      //response.success();
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
      //response.error();
    }
  });
})

Parse.Cloud.job('DailyPressSignals', function(request, status) {
  //TODO - maybe add company research for all companies not researched
  
  Parse.Cloud.httpRequest({
    url:PROSPECTER_URL+'/v1/daily_press_cron',
    success: function(httpResponse) {
      console.log(httpResponse.text)
      //response.success();
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
      //response.error();
    }
  });

  /*
  Parse.Cloud.httpRequest({
    url:'http://prospecter.herokuapp.com/v1/daily_industry_press_scrape',
    success: function(httpResponse) {
      console.log(httpResponse.text)
      //response.success();
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
      //response.error();
    }
  });
  */
});

Parse.Cloud.job('SignalDailyEmail', function(request, status) {
  Parse.Cloud.httpRequest({
    url:PROSPECTER_URL+'/v1/signal_daily_email',
    success: function(httpResponse) {
      console.log(httpResponse.text)
      //response.success();
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
      //response.error();
    }
  });
});

Parse.Cloud.job('EnsureAllProspectsAreResearched', function(request, status) {
  Parse.Cloud.httpRequest({
    url:PROSPECTER_URL+'/v1/ensure_research',
    success: function(httpResponse) {
      console.log(httpResponse.text)
      response.success();
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
      response.error();
    }
  });
});

/*
Parse.Cloud.beforeSave("Press", function(request, response) {
  // 
  // TODO - if link exists dont' save
  // TODO - not working
  var Press = Parse.Object.extend("Press")
  var query = new Parse.Query(Press);

  console.log(request.object.get("url"))
  console.log("lol")
  //response.success()
  query.equalTo("url", request.object.get("url"))
  if(request.object.get("company_name")){
    response.success()
  }
  //console.log(request.object.get("url"))
  query.find({
    success: function(res) {
      console.log("success")
      console.log(res)
      if(res.length) {
        response.error()
      } else {
        response.success()
      }
    },
    error: function(err) {
      response.error()
    },
  })

  Parse.Cloud.httpRequest({
    url:'http://prospecter.herokuapp.com/v1/press_webhook',
    data: request,
    success: function(httpResponse) {
      console.log(httpResponse.text)
      response.success();
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
      response.error();
    }
  });
  response.success();
})
*/
/*
Parse.Cloud.afterSave("CompanyEmailPatternCrawl", function(request, response) {
  Parse.Cloud.httpRequest({
    url:CLEARSPARK_URL+'/v1/score/email_pattern',
    data: {domain: request.object.get("domain"), 
           company_name: request.object.get("company_name")},
    success: function(httpResponse) {
      console.log(httpResponse.text)
      response.success();
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
      response.error();
    }
  });
})
*/


// TODO - have a seperate webhook module - CloudElement, ContextIO, MailGun, Cronofy
//

Parse.Cloud.afterSave("Company", function(request, response) {
  Parse.Cloud.httpRequest({
    url:CLEARSPARK_URL+'/v1/secondary_research',
    data: {domain: request.object.get("domain"), 
           company_name: request.object.get("company_name")},
    success: function(httpResponse) {
      console.log(httpResponse.text)
      response.success();
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
      response.error();
    }
  });
})

Parse.Cloud.afterSave("CompanySignal", function(request, response) {
  Parse.Cloud.httpRequest({
    url:CLEARSPARK_URL+'/v1/company_signal_webhook',
    data: {company_name: request.object.get("company_name")},
    success: function(httpResponse) {
      console.log(httpResponse.text)
      response.success();
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
      response.error();
    }
  });
})

Parse.Cloud.afterSave("Prospect", function(request, response) {
  var Integration = Parse.Object.extend("Integration");
  var query = new Parse.Query(Integration);
  //TODO - get integration crm + the same user_id as prospect
  query.get(user_id, {
    success: function(crm) {
      //TODO persist prospect data with creds
      var conn = new jsforce.Connection({
        oauth2 : {
          clientId : crm.clientId,
          clientSecret : '<your Salesforce OAuth2 client secret is here>',
          redirectUri : '<your Salesforce OAuth2 redirect URI is here>'
        },
        instanceUrl : '',
        accessToken : '<your Salesforrce OAuth2 access token is here>',
        refreshToken : '<your Salesforce OAuth2 refresh token is here>'
      })

      conn.sobject("Lead").create({ Name : 'My Account #1' }, function(err, ret) {
        if (err || !ret.success) { 
          response.error()
          return console.error(err, ret); 
        }
        console.log("Created record id : " + ret.id);
        response.success();
      });
    },
    error: function(obj, err) {
      response.error();
    }
  })
})

Parse.Cloud.afterSave("CompanyProspect", function(request, response) {
  Parse.Cloud.httpRequest({
    url:CLEARSPARK_URL+'/v1/company_prospect_webhook',
    data: {company_name: request.object.get("company_name")},
    success: function(httpResponse) {
      console.log(httpResponse.text)
      response.success();
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
      response.error();
    }
  });
  // Persist To Salesforce
})


Parse.Cloud.beforeSave("PeopleSignal", function(request, response) {
  if(request.object.isNew()) {
    var query = new Parse.Query("PeopleSignal");
    query.equalTo("url", request.object.get("url"));// and belongs to current user
    query.first({
      success: function(object) {
        if (object) {
          //response.error("A PeopleSignal with this Linkedin URL already exists.");
          response.success();
        } else {
          response.success();
        }
      },
      error: function(error) {
        response.error("Could not validate uniqueness for this PeopleSignal object.");
      }
    });
  } else {
    response.success();
  }
});

Parse.Cloud.afterSave("PeopleSignal", function(request, response) {
  var pusher = new Pusher({
    appId: '70217',
    key: '1a68a96c8fde938fa75a',
    secret: 'e60c9259d0618b479ec2'
  });
  var signalReport = Parse.Object.extend("SignalReport")
  var signalReport = new Parse.Query(signalReport)
  // Add Mailgun Email

  var query = new Parse.Query("PeopleSignal")
  query.equalTo("profile", request.object.get("profile"))
  query.count({
    success: function(count) {
      console.log("FIRST COUNT -> "+count);
      signalReport.get(request.object.get("signal_report").id, {
        success: function(signalReport) {
          signalReport.set("people_count", count)
          signalReport.save()
          console.log("SUCCESS -> "+count);
          console.log(request.object.get('profile').id)
          req = request.object

          pusher.trigger(request.object.get('profile').id, 'my-event', 
                         {"count":count,
                          "name":utf8.encode(req.get("name")),
                          "company":utf8.encode(req.get("company")),
                          "title":utf8.encode(req.get("title"))});
        },
        error: function(error) {
          console.log("UPDATE ERROR")
        }
      })
    },
    error: function(error) {
      console.log("COUNT ERROR")
      response.error();
    }
  })
})

/*
Parse.Cloud.beforeSave("CompanySignal", function(request, response) {
  if(request.object.isNew()) {
    var query = new Parse.Query("PeopleSignal");
    query.equalTo("url", request.object.get("url"));// and belongs to current user
    query.first({
      success: function(object) {
        if (object) {
          //response.error("A PeopleSignal with this Linkedin URL already exists.");
          response.success();
        } else {
          response.success();
        }
      },
      error: function(error) {
        response.error("Could not validate uniqueness for this PeopleSignal object.");
      }
    });
  } else {
    response.success();
  }
});
*/

/*
Parse.Cloud.afterSave("CompanySignal", function(request, response) {
  var pusher = new Pusher({
    appId: '70217',
    key: '1a68a96c8fde938fa75a',
    secret: 'e60c9259d0618b479ec2'
  });
  // Add Mailgun Email When Done

  var signalReport = Parse.Object.extend("SignalReport")
  var signalReport = new Parse.Query(signalReport)

  var query = new Parse.Query("PeopleSignal")
  query.equalTo("profile", request.object.get("profile"))
  query.count({
    success: function(count) {
      signalReport.get(request.object.get("signal_report").id, {
        success: function(signalReport) {
          signalReport.set("company_count", count)
          signalReport.save()
          req = request.object

          pusher.trigger(request.object.get('profile').id, 'my-event', 
                         {"count":count,
                          "name":utf8.encode(req.get("name")),
                          "company":utf8.encode(req.get("company")),
                          "title":utf8.encode(req.get("title"))});
        },
        error: function(error) {
          console.log("UPDATE ERROR")
        }
      })
    },
    error: function(error) {
      console.log("COUNT ERROR")
    }
  })
})

Parse.Cloud.afterSave('CompanyProspect', function(request, response) {
  // TODO - 
  //
  console.log('Prospect After Save')
  console.log(request.object.existed())
  if(request.object.existed() == false)
    // Increment and Decrement Prospect Lists
    console.log('Request Object Exists')
    console.log(request.object.get('lists'))
    console.log(request.object.get('lists').length)
    if(request.object.get('lists').length) {
      query =  new Parse.Query("CompanyProspectList")
      console.log(request.object.get('prospectType'))
      console.log(request.object.get('lists')[0])
      console.log(request.object.get('lists')[0].id)
      console.log(request.object.get('lists')[0].get('objectId'))
      query.get(request.object.get('lists')[0].id,{
        success: function(list) {
          console.log('success')
          console.log(list)
          list.increment("count")
          list.save()
          console.log(list)
        },
        error: function(error) {
          console.log(error)
        }
      });
    }
})
*/

/*
Parse.Cloud.afterSave('Prospect', function(request, response) {
  // TODO - object.existed is not working
  query =  new Parse.Query("Prospect")
  query.get(request.object.id, {
    success: function() {
      if(request.object.get('lists').length) {
        query =  new Parse.Query("ProspectList")
        query.get(request.object.get('lists')[0].id,{
          success: function(list) {
            list.increment("count");
            list.save();
          },
          error: function(error) {
            console.log(error)
          }
        });
      }
    },
    error: function(error) {
      console.log(error)
    }
  })
});
*/


/*
   FYI, if you want to distinguish between Update and Insert, you need to insert the following code before calling query.first(). :-)

   query.equalTo("id", request.object.id);
   or you can do request.object.exists()
*/

Parse.Cloud.define("oauth_integration", function(request, response) {
  console.log("oauth_integration request")
  console.log(request.body)
  console.log(request.body.source)
  console.log(request.params.source)

  if(request.params.source == "gmail") {
    Parse.Cloud.httpRequest({
      method:"POST",
      url: "https://accounts.google.com/o/oauth2/token",
      params: Integrations.google.appData(request.code)
    }).then(function(res) {
        console.log(res)
        Integrations.persist(res, "gmail", "inbox").then(function(res) {
          console.log("persisted")
          console.log(res)
        })

        Integrations.contextio.createAccount(res).then(function(res) {
          Integrations.persist(res, "contextio", "inbox").then(function(res) {
            console.log("persisted")
            console.log(res)
          })

          Integrations.contextio.importContacts(res).then(function(res) {
            // start contact import
            // paginate
          })
        })
        response.success()
    })
  } else if(request.body.source == "outlook" ) {

    Parse.Cloud.httpRequest({
      method:"POST",
      url: "https://login.live.com/oauth20_token.srf",
      params: Integrations.outlook.appData(request.code),
      headers:{'Content-Type' : 'application/x-www-form-urlencoded'}
    }).then(function(res) {
        console.log(res)
        // store token in integration table
        Integrations.persist(res, "outlook", "inbox").then(function(res) {
          console.log("persisted")
          console.log(res)
        })

        // Create ContextIO account
        Integrations.contextio.createAccount(res).then(function(res) {
          Integrations.persist(res, "contextio", "inbox").then(function(res) {
            console.log("persisted")
            console.log(res)
          })

          Integrations.contextio.importContacts(res).then(function(res) {
            // start contact import
            // paginate
          })
        })
        response.success()
    })
  } else if (request.params.source == "cronofy" ) {

    Parse.Cloud.httpRequest({
      method:"POST",
      url: "https://api.cronofy.com/oauth/token",
      params: Integrations.outlook.appData(request.code),
    }).then(function(res) {
        console.log(res)
        // get refresh token
        // store token in integration table
        // start event import
        Integrations.persist(res, "cronofy", "calendar").then(function(res) {
          console.log("persisted")
          console.log(res)
        })

        Integrations.cronofy.initialEventImport(res).then(function(res) {
          console.log("persisted")
          console.log(res)
        })
        response.success()
    })
  } else if (request.params.source == "salesforce" ) {

    console.log("started salesforce stuff")
    console.log(Integrations.salesforce.appData(request.params.code))
    _params = Integrations.salesforce.appData(request.params.code)
    Parse.Cloud.httpRequest({
      method:"POST",
      url: "https://login.salesforce.com/services/oauth2/token",
      params: _params,
    }).then(function(res) {
        console.log("salesforce refresh token")
        console.log(res)
        Integrations.persist(res, "salesforce", "crm",res.state).then(function(res){
          console.log("persisted")
          console.log(res)
          response.success()
        })
        // create CloudElement
        // store CloudElement details in Integration
        // start contact import
    }, function(err) {
        console.log("ERROR")
        console.log(err)
        response.error()
    })
  } else {
    response.error()
  }
})

Parse.Cloud.define("test_email", function(request, response) {
  console.log(request)
  Mailgun.initialize('myDomainName', 'myAPIKey');
  Mailgun.sendEmail({
    to: "email@example.com",
    from: "Mailgun@CloudCode.com",
    subject: "Hello from Cloud Code!",
    text: "Using Parse and Mailgun is great!"
  }, {
    success: function(httpResponse) {
      console.log(httpResponse);
      response.success("Email sent!");
    },
    error: function(httpResponse) {
      console.error(httpResponse);
      response.error("Uh oh, something went wrong");
    }
  });
})

Parse.Cloud.define("mailgun_webhook", function(request, response) {
  console.log(request)
  console.log(request.body)
  console.log(request.params.event)
  console.log(request.params["Message-Id"])
  //console.log(request.body.get("Message-Id"))
  console.log("THE MAILGUN WEBHOOK")
  // TODO - find email by sent email
  var SentEmail = Parse.Object.extend("SentEmail")
  var query = new Parse.Query(SentEmail);

  if(typeof(request.params["Message-Id"]) == "undefined") {
    messageId = "<"+request.params["message-id"]+">"
  } else {
    messageId = request.params["Message-Id"]
  }

  console.log(messageId)

  query.equalTo("mailgun_id", messageId)
  query.find({
    success: function(res) {
      // update object event with timestamp - Date.now()
      console.log("QRY Response")
      console.log(res)
      for(i=0; i< res.length; i++) {
        var object = res[i];
        object.set(request.params.event, Date.now())
        object.save()
      }
      response.success("saved object")
    },
    error: function(err) {
      response.error("could not find mailgun")
    },
  })
})
