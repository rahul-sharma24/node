in app.use if you are using / then it is like wild card so if you do anything 
like localhost:3000 or localhost:3000/hello or anything only this will come 
so sequence does matters in this if you have defined app.use('/') first 
and then you have defined app.use('/hello') then 
/ will work everwhere even for /hello 
but if we have defined /hello first then it will work 

see routing patterns like - + , * ? ,()?, regex /a/ -> containing 'a', '/*fly$/'

in req.query ,, req.param
if you want user/100 user/191
then "/user/:userId"

middlewear and routehandlers(); -- middle wear is to check that user is actually authenticated or not 
so middlewear can be for authentication.

middle wears are written for app.use() so that it can check all apis 
what is difference in Use v/s all app.use v/s app.all


<!-- authentication and JWT Token -->