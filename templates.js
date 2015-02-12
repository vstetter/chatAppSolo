var templates =[];

//message template

templates.messageTmpl = [
'<article data-chatid="<%= _id %>" data-userid="<%= userId %>">',
// '<h4><%= userId %></h4>',
'<p class="userMessage"><span><%= userName %></span>   <%= userMessage %><button class = "deleteMsg btn btn-default"><i class="fa fa-times"></i></button></p>',
'</article>'

].join("");



templates.userList = [

'<li rel="<%= userName %>" data-itemid="<%= _id %>">',
'<h3 class="userName"><%= userName %>  <a class="logout" href="">Log Out</a></h3>',
'</li>'

].join("");
