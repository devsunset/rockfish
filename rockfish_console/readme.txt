■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
## ■ rockfish console
``` 
   * rockfish console ui (AXU & axijs) - TO-DO   
   * rockfish console (nodejs & express) - TO-DO   
``` 
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


db.getCollection('rockfish_service_log').aggregate([
     {
         
         
          $group : {
               _id : { $dateToString: { format: "%Y-%m-%d", date: "$REQUEST_TIME" } },  // group의 기준을 path 필드로 한다.
               count : {
                    $sum : 1    // $sum 을 통해 1씩 누적한다.
               }
          }
     },
     {
          $project : {
               _id : 0,         // _id는 projection에서 제외.
               datetime : "$_id",   // _id를 path로 projection 하기 위해 사용.
               count : 1
          }
     },
     { $sort : {count : -1}}
]);