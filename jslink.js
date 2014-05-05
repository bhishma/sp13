(function () { 
 
    // Create object that have the context information about the field that we want to change it's output render  
    var bodyFieldContext = {}; 
    bodyFieldContext.Templates = {}; 
    bodyFieldContext.Templates.Fields = { 
        // Apply the new rendering for Body field on list view 
        'FullUrl': { 'View': makeLink } 
    }; 
 
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(bodyFieldContext); 
 
})(); 
 
function makeLink(ctx) { 
 var val = ctx.CurrentItem.FullUrl;

 //remove html tags
 var reg1 = /(<([^>]+)>)/ig; 
  val = val.replace(reg1, "");

  //remove ** and replace with =
  var reg2 = /\*\*+/ig; 
  val = val.replace(reg2, "="); 

  //remove * and replace with #
  var reg3=/\*+/ig;
  val = val.replace(reg3, "#");
 

val="<a href=\'"+val+"\' target=\'_blank\'>Test Your Query</a>";
return val;
} 
