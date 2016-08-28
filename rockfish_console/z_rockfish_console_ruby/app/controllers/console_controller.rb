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
end