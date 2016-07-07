class ConsoleController < ApplicationController
  def index
  	render :file => 'public/login.html'
  end
end
