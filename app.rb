require 'sinatra'
require "sinatra/reloader" if development?
#require 'haml'
#require 'twitter'
#require 'faraday'
#require 'omniauth'
require 'uri'
require 'open-uri'
require 'json'
require 'pp'

#TWITTER_CONSUMER_KEY    = ENV['TWITTER_CONSUMER_KEY']
#TWITTER_CONSUMER_SECRET = ENV['TWITTER_CONSUMER_SECRET']
#TWITTER_ACCESS_TOKEN    = ENV['TWITTER_ACCESS_TOKEN']
#TWITTER_ACCESS_SECRET   = ENV['TWITTER_ACCESS_SECRET']

      #SESSION_SECRET = ENV['SESSION_SECRET']

   SHIRASETE_API_KEY = ENV['SHIRASETE_API_KEY']
SHIRASETE_PROJECT_ID = ENV['SHIRASETE_PROJECT_ID']

  SHIRASETE_BASE_URL = ENV['SHIRASETE_BASE_URL'] || "http://beta.shirasete.jp/"
#SHIRASETE_CATEGORIES = "http://beta.shirasete.jp/projects/22/issue_categories.json?key=#{SHIRASETE_API_KEY}"

configure do
  #use Rack::Auth::Basic do |username, password|
  #  username == ENV['BASIC_AUTH_USERNAME'] && password == ENV['BASIC_AUTH_PASSWORD']
  #end

  #enable :sessions
  #set :session_secret, 'aeiha3889aow'
  #enable :sessions, :logging

  #use OmniAuth::Builder do
  #  provider :twitter, TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET
  #end

  #client = Twitter::REST::Client.new do |config|
  #  config.consumer_key        = TWITTER_CONSUMER_KEY
  #  config.consumer_secret     = TWITTER_CONSUMER_SECRET
  #  config.access_token        = TWITTER_ACCESS_TOKEN
  #  config.access_token_secret = TWITTER_ACCESS_SECRET
  #end
  #set :twitter_client, client
  
  conn = Faraday::Connection.new(:url => SHIRASETE_BASE_URL) do |builder|
    builder.use Faraday::Request::UrlEncoded  # リクエストパラメータを URL エンコードする
    builder.use Faraday::Response::Logger     # リクエストを標準出力に出力する
    builder.use Faraday::Adapter::NetHttp     # Net/HTTP をアダプターに使う
  end
  set :faraday, conn

  mime_type :json, 'application/json'
end

get '/' do
  #if session[:user_twitter_access_token] and session[:user_twitter_access_token_secret]
  #  haml :index, :layout => nil
  #else
  #  redirect '/auth/twitter'
  #end
  erb :index, :layout => nil
end

get '/issue_categories.json' do
  p params
  #url = URI.join(SHIRASETE_BASE_URL, "/projects/#{SHIRASETE_PROJECT_ID}/issue_categories.json")
  #url = url
  conn = settings.faraday
  res = conn.get("/projects/#{SHIRASETE_PROJECT_ID}/issue_categories.json", {:key => SHIRASETE_API_KEY})
  content_type :json
  res.body
end

get '/issues.json' do
  puts "issues: #{params.inspect}"
  params[:key] = SHIRASETE_API_KEY
  params[:project_id] = SHIRASETE_PROJECT_ID
  conn = settings.faraday
  res = conn.get("/issues.json", params)
  content_type :json
  res.body
end

get '/issue/:id.json' do
end

