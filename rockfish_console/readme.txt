■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
## ■ rockfish console
   * rockfish console ui (AXU & axijs) - TO-DO   
   * rockfish console (nodejs & express) - TO-DO   
   * rockfish console (python & django) - Next TO-DO   
   * rockfish console (ruby & rails) - Next TO-DO

■■■ console server start ■■■

#nodejs
(Windows)
set DEBUG=rockfish_console_nodejs:* & npm start 
(Linux)
DEBUG=rockfish_console_nodejs:* npm start 

#python
python manage.py runserver 3000

#ruby
rails server

■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

-------------------------------------------------------------------------------

db.getCollection('rockfish_service_log').find(
    {  SEND_TYPE : 'D' }
)


db.getCollection('rockfish_service_log').find(
    {  'ACCESS.ROCKFISH_SEND_TYPE' : 'D' }
)

--------------------------------------------------------------------------------------
