# require
require 'mongo'
require 'neatjson'


# Turn off debug-mode
Mongo::Logger.logger.level = Logger::WARN


class ConsoleController < ApplicationController

  # mongodb client
  @@client = Mongo::Client.new('mongodb://rockfish:rockfish@localhost:27017/rockfish')

  # index page
  def index
  	render :file => 'public/index.html'
  end

  ############################################################################################
  ## LOGIN ,LOGOUT , SESSION CHECK PROCESS
  ############################################################################################

  # session check process
  def sessionCheck
     response_data = {}
     response_data['rockfish_result_code'] = 'E'

   if !session[:user_id].nil?
      response_data['rockfish_result_code'] = 'S'
      userInfo = {}
      userInfo['user_id'] = session[:user_id]
      userInfo['user_name'] = session[:user_name]
      response_data['rockfish_result_data'] = userInfo
   end

    render :json => response_data
  end

  ### TO - DO RSA decrypted and AES Encrypted
  # login process
  def login
    puts('###########################')
    puts(params[:ID])
    puts(params[:PASSWORD])
    puts('###########################')
   
    result = @@client[:rockfish_admin_master].find({"ID":"rockfish"})

    result.each do |document|
      puts JSON.neat_generate(document)
    end

    session[:user_id] = 'rockfish'
    session[:user_name] ='rockfish'

    response_data = {}
    response_data['rockfish_result_code'] = 'S'
    response_data['rockfish_result_msg'] = 'login success.' #login fail.

    render :json => response_data
  end

  # logout process
  def logout
    session[:user_id] = nil
    session[:user_name] = nil

    response_data = {}
    response_data['rockfish_result_code'] = 'S'

    render :json => response_data
  end

  ##############################################################################################
  ## DASHBOARD PROCESS
  ##############################################################################################

  ## dashboard top 5 App Service Call process
  def dashboardTop5AppInfo
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end

  ## dashboard Service Call Summary process
  def dashboardServiceInfo
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end

  ## dashboard Service Call Result process
  def dashboardServiceResultInfo
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end

  ## dashboard Service Call History process
  def dashboardServiceHistoryInfo
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end

  ##############################################################################################
  ## MONITORING PROCESS
  ##############################################################################################

  ## monitoring Client OS process
  def montoringClientOsInfo
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end

  ## monitoring Client OS Version process
  def montoringClientOsVersionInfo
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end

  ## monitoring Send Type process
  def montoringSendTypeInfo
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end

  ## monitoring Encrypt process
  def montoringEncryptInfo
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end

  ## monitoring Service Response Http Status Code process
  def montoringServiceResponseHttpStatusCodeInfo
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end

  ## monitoringService Response Http Code Service Protocol process
  def montoringServiceProtocolInfo
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end

  ##############################################################################################
  ## LOG PROCESS
  ##############################################################################################

  ## log search list process
  def logSearchList
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end

  ## log info process
  def logInfo
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end


  ##############################################################################################
  ## SERVICE PROCESS
  ##############################################################################################

  ## service search list process
  def serviceSearchList
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end

  ## service info process
  def serviceInfo
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end

  ## service save process
  def serviceSave
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end

  ## service delete process
  def serviceDelete
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end

  ##############################################################################################
  ## ADMIN PROCESS
  ##############################################################################################

  ## admin search list process
  def adminSearchList
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end

  ## admin info process
  def adminInfo
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end

  ## admin save process
  def adminSave
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end

  ## admin delete process
  def adminDelete
      #TO-DO
      response_data = {}
      
   render :json => response_data
  end

end