■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
## ■ rockfish console
   * rockfish console ui (AXU & axijs) - TO-DO   
   * rockfish console (nodejs & express) - TO-DO   
   * rockfish console (python & django) - TO-DO   
   * rockfish console (ruby & rails) - TO-DO

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

1. DB선택
test라는 DB를 사용하겠다고 아래와 같이 입력한다.
> use test
switched to db test

실제로 DB가 변경되었는지 확인하기 위해 아래와 같이 입력한다.
> db
test

2. 화면지우기
명령프롬프트와 마찬가지로 화면을 지우기 위해서는 cls를 사용할 수 있다.
> cls

3. 문서 생성하기
먼저 변수에 문서를 하나 할당한다.
> person = { "name" : "neo", "age" : 20, "regdate" : new Date() }
{
"name" : "neo",
"age" : 20,
"regdate" : ISODate("2012-12-27T18:49:12.699Z")
}
> db.person.insert(person)

4. 문서 추가하기
#3처럼 변수를 통해 문서를 생성할 수 있으나, 아래처럼 insert에 바로 입력해도 된다.
> db.person.insert({ "name" : "joe", "age" : 21, "regdate" : new Date() })

5. 이미 생성된 문서에 항목 추가하기
이름이 neo인 문서에 gender 항목 추가
> db.person.update({ name : "neo" }, { $set : { gender : "M" }})

이름이 joe인 문서에 gender 항목 추가
> db.person.update({ name : "joe" }, { $set : { gender : "F" }})

6. 생성된 문서를 조회
> db.person.find()
> db.person.findOne()
> db.person.find({ name : "neo" })
> db.person.find({ name : "neo", $or : [{ age : 20 }, { age : 21 }] });
> db.person.find({ name : "neo", $nor : [{ age : 20 }, { age : 21 }] });
> db.person.find({ age : { $in : [20, 21] }})
> db.person.find({ age : { $nin : [20, 21] }})

특정 항목만 조회 / 특정 항목만 제외하고 조회
> db.person.findOne({ name : "neo" }, { name : 1, regdate : 1 })
{
"_id" : ObjectId("aaaaaaaaaaaaaaaaaaaaa"),
"name" : "neo",
"regdate" : ISODate("2012-12-27T18:49:12.699Z")
}

> db.person.findOne({ name : "neo" }, { name : 0, regdate : 0 })
{
"_id" : ObjectId("aaaaaaaaaaaaaaaaaaaaa"),
"age" : 21,
"gender" : "M"
}

항목의 값이 null인 문서만 조회
> db.person.find({ name : null })
> db.person.find({ name : { $type : 10 }}) // $type = 10이 null 값

조회 시 정렬
- 내림차순 정렬 (DESC)
> db.person.find().sort({ name : 1 }) 

- 오름차순 정렬 (ASC)
> db.person.find().sort({ name : -1 })

제한된 조회
- TOP 2 혹은 LIMIT 0,2 처럼 상위 2개만 조회
> db.person.find().limit(2)
- LIMIT 2,2 처럼 상위 2개를 건너 3,4번째만 조회
> db.person.find().limit(2).skip(2)

문서의 갯수 확인
> db.person.count()
> db.person.find({ name : "neo" }).count()

문서 중 특정항목이 없는 문서 확인
> db.person.find({ name : { $exists : false } })

나머지값 연산
>db.person.find({ age : { $mod : [5] } }) // mod(age,5) = 0
>db.person.find({ age : { $mod : [5,1] } }) // mod(age,5) = 1

7. 항목의 값을 변경하기
항목의 문자열값을 변경
> db.person.update({ name : "joe" }, { $set : { gender : "M" }})

항목의 숫자값에 가감을 하여 변경
>db.person.update({ name : "neo" }, { $inc : { age : 1 }})
>db.person.update({ name : "neo" }, { $inc : { age : 10 }})
>db.person.update({ name : "neo" }, { $inc : { age : -11 }})

8. 문서지우기
> db.person.remove({ name : "joe" })
> db.person.remove()

0. ETC
$set
문서에 항목이 있다면 그 항목의 값을 변경하고, 항목이 없다면 그 항목을 지정된 값으로 추가한다.


$inc
숫자형 값에만 사용할 수 있는 제한자로 숫자를 가감할 때 사용한다.

$maxscan
쿼리 시 조회할 최대의 문서 수를 지정한다.
> db.person.find( { } )._addSpecial( "$maxscan", 10 )
> db.person.find( { $query : { }, $maxscan : 10 } )

 
$min
쿼리 시 특정 키의 값이 최소 x까지만 조회
> db.person.find().min( { age : 21 } )

$max
쿼리 시 특정 키의 값이 최대 x까지만 조회
> db.person.find().max( { age : 21 } )

 
$explain
실제로 쿼리를 수행하지 않고 쿼리플랜을 표시한다.
> db.person.find().explain()


--------------------------------------------------------------------------------------


SELECT host, path, count(*) as count
FROM access
GROUP BY path

> use apache
switched to db apache
> db.access.findOne();
{
        "_id" : ObjectId("515a6de1a551bd568a000001"),
        "host" : "127.0.0.1",
        "user" : "-",
        "method" : "GET",
        "path" : "/",
        "code" : "200",
        "size" : "48",
        "time" : ISODate("2013-04-02T05:34:22Z")
}

//sort/limit 등을 사용하기 어렵고 샤드 클러스터 환경에서는 동작하지 않는 단점
db.access.group({
    "key" : {
        "path" : 1        // grouping이 될 key 값을 지정함.
    },
    "initial" : {
        "count" : 0       // count 값을 0으로 초기함.
    },
    "reduce" : function(curr, result) {
        result.count++;   // 집계시 result의 count값에 1씩 누적함.
    }
});


//mongoDB 2.1 버전부터 지원하는 aggregation framework
db.access.aggregate([
     {
          $group : {
               _id : "$path",  // group의 기준을 path 필드로 한다.
               count : {
                    $sum : 1    // $sum 을 통해 1씩 누적한다.
               }
          }
     },
     {
          $project : {
               _id : 0,         // _id는 projection에서 제외.
               path : "$_id",   // _id를 path로 projection 하기 위해 사용.
               count : 1
          }
     },
     { $sort : {count : -1}},   // count를 기준으로 역정렬.
     { $limit : 3 }             // 3개까지만 출력.
]);

>
{
        "result" : [
                {
                        "count" : 1744,
                        "path" : "/"
                },
                {
                        "count" : 98,
                        "path" : "*"
                },
                {
                        "count" : 71,
                        "path" : "/robots.txt"
                }
        ],
        "ok" : 1
}



var map = function() {
     emit(this.path, { count : 1 });
}

var reduce = function(keys, values) {
     var total = 0;
     values.forEach(function(value){
          total += value.count;
     });
     return { count : total };
}

db.access.mapReduce(
    map,
    reduce,
    {
          out: "access_output"    // 결과가 담길 컬렉션 이름.
    }
)

> db.access_output.find().sort({value:-1}).limit(3);
{ "_id" : "/", "value" : { "count" : 1744 } }
{ "_id" : "*", "value" : { "count" : 98 } }
{ "_id" : "/robots.txt", "value" : { "count" : 71 } }