/*
* This will include selected stuff from SPFF codeplex solution.
* Only need the text box stuff.
* 
* @requires jQuery 1.3.1
*/
//module pattern
(function(){
    var params = window.location.search.substring(1).split("&"),
    kv = {},
    opts,
    sp=/%20|\+/g,
    datetime=/([1-9]|0[1-9]|1[012])[\-\/\.]([1-9]|0[1-9]|[12][0-9]|3[01])[\-\/\.](19|20)\d\d\s([0-1][0-2]|[0-9]):([0-9]{2})\s(A|P)M/i,
    date=/([1-9]|0[1-9]|1[012])[\-\/\.]([1-9]|0[1-9]|[12][0-9]|3[01])[\-\/\.](19|20)\d\d/,
    clean = function(str){
        return str.replace(sp," ");
    },
    getKv = function(){
        $.each(params,function(i,e){
            var p=e.split("=");
            kv[p[0]]=decodeURIComponent(p[1]);
        });
        return kv;
    },
    handleError = function(){
        return true;
    },
    defaults = {
        lock:false,
        lockColor:"#ccc",
        lockBkg:{
            "background":"url('/_layouts/images/IMNDND.PNG') no-repeat right"
        }
    };
    /**
     * @name spff
     * @description extends the jQuery object to allow manipulation of form fields through
     * query string parameters
     * @param options
     * @constructor
     * @see defaults
     * @example
     * $(function(){
     *   $.spff({lock:true});
     * });
     * @example
     * $(function(){
     *   if(window.location.pathname.split('/').reverse()[0]=="NewForm.aspx"){
     *     $.spff();
     *   }
     * });
     */
    jQuery.spff = function(options){
        if (params[0]===""){
            return false; //break do not continue
        }
        var o = $.extend({},defaults,options);
        $.each(getKv(),function(k,v){
            k=clean(k);
            v=clean(v);
            var f=$("[title='"+k+"']:input", "#part1"),
            job;
            if (f.length>0){
                if (f[0].type=="text"){
                    job=10;
                } //text
                if (f[0].type=="checkbox"){
                    job=20;
                } //checkbox
                if (f[0].tagName=="SPAN"&&f.hasClass("ms-RadioText")){
                    job=30;
                } //radio
                if (f[0].type=="select-one"&&f[0].tagName=="SELECT"){
                    job=10;
                } //choice and non-IE lookup
                if (f[0].tagName=="TEXTAREA"){
                    job=10;
                } //textarea
                if (f[0].type=="text"&&f[0].opt=="_Select"){
                    job=70;
                } //IE lookup
                if (v.match(date)){
                    job=40;
                } //date
                if (v.match(datetime)){
                    job=50;
                } //datetime
				var tdclass = f.parent().attr("class");
            }
            if (f.length===0){
                var elm = $("nobr:contains('"+k+"'):first", "#part1");
                if (elm.length>0){
                    elm = elm.parents("td").next()[0];
                    var s1 = $(elm).find("select:first"),
                    s2 = $(elm).find("select:last"),
					c1 = $(elm).find("input[type='checkbox']"),
					r1 = $(elm).find("input[type='radio']"),
                    p1 = $(elm).find("textarea[title='People Picker']"),
                    p2 = $(elm).find("div[title='People Picker']"),
                    vals = v.split(",");
                    if (s1.length>0){
                        f=s2; job=80;
                    } //multi-select
					if (c1.length>0){
						f=c1[0]; job=60;
					} //multi checkbox
					if (r1.length>0){
						f=r1[0]; job=65;
					} //radio
                    if (p1.length>0){
                        f=p1; job=90;
                    } //people picker
                }else{
					return true; //break and continue
				}
            }
            if (v=="_"){
                job=0;
				if (tdclass && tdclass=="ms-dtinput"){
					job=3;
				}
				if (s1){
					job=1;
				}
				if (c1 || r1 ){
					job=2;
				}
			} //hide it
			switch (job){
                case 0:
                    f.parents("tr:first").hide();
                    break;
                case 1:
                    if (s1.length>0){
                        f.parents("tr:eq(1)").hide();
                    }else{
                        f.parents("tr:eq(2)").hide();
                    }
                    break;
                case 2:
                    $(f).parents("tr:eq(1)").hide();
                    break;
                case 3:
                    f.parents("tr:eq(1)").hide();
                    break;
                case 10:
                    if (v.substring(0,1)=="@"){
                        opts = f[0].options;
                        $.each(opts,function(i,e){
                            if (opts[i].value==v.substring(1)){
                                f[0].selectedIndex=i;
                            }
                        });
                    }
					var hlink = $(f).siblings("input[title='Description']");
					if (hlink.length>0){
						f.val(v.split(',')[0]);
						hlink.val(v.split(',')[1]);
						f = f.add(hlink);
					}else{
						f.val(v);
                    }
                    if (f[0].tagName=="TEXTAREA" && o.lock===true){
                        f.show().siblings().hide();
                    }
                    break;
                case 20:
                    if (v.toUpperCase()=="TRUE"||v=="1"){
                        f[0].checked=true;
                    }
                    if (v.toUpperCase()=="FALSE"||v=="0"){
                        f[0].checked=false;
                    }
                    break;
                case 30:
                    if (v.toUpperCase()=="TRUE"||v=="1"){
                        f.find("input:radio").click();
                    }
                    break;
                case 40:
                    v=v.replace(/[\-\/\.]/g,"/");
                    f.val(v);
                    break;
                case 50:
                    var dt=v.split(" "),
                    d=dt[0].replace(/[\-\/\.]/g,"/"),
                    t=dt[1],
                    hm=t.split(":"),
                    hh=hm[0].replace(/^0/,""),
                    mm=hm[1],
                    ap=dt[2].toUpperCase();
                    f.val(d);
                    var t1 = f.parent("td").siblings("td.ms-dttimeinput").find("select:first"),
                    t2 = f.parent("td").siblings("td.ms-dttimeinput").find("select:last");
                    t1.val(hh+" "+ap);
                    t2.val(mm);
                    f=f.add(t1).add(t2);
                    break;
				case 60:
					$.each(vals,function(i,e){
						if (e.toUpperCase()=="TRUE"||e=="1"){
							c1[i].checked=true;
						}
						if (e.toUpperCase()=="FALSE"||e=="0"){
							c1[i].checked=false;
						}
					});
					break;
				case 65:
					r1[v-1].checked=true;
					break;
				case 70:
                    if (v.substring(0,1)=="@"){
                        ShowDropdown(f[0].id);
                        opts = $("#_Select")[0].options;
                        $.each(opts,function(i,e){
                            if (opts[i].value==v.substring(1)){
                                $("#_Select")[0].selectedIndex=i;
                            }
                        });
                        f.blur();
                    }else{
                        f.val(v);
                        ShowDropdown(f[0].id);
                        f.blur();
                    }
                    break;
                case 80:
                    opts = $("option",s1);
                    $(opts).attr("selected",false);
                    var addbtn = s1.parents("tr:first").find("button:first");
                    opts = $.grep(opts,function(e,i){
                        return ($.inArray("@"+e.value,vals)>-1 || $.inArray(e.text,vals)>-1);
                    });
                    $(opts).attr("selected",true);
                    addbtn.click();
                    if (o.lock===true){
                        f.attr("disabled",true).find("option").attr("selected",false);
                    }
                    break;
                case 90:
                    var p=vals.join(";");
                    p1.val(p);
                    p2.html(p);
                    break;
            //default:
            }
            if (f.length > 0 && o.lock === true){
                f.css({
                    "background-color":o.lockColor
                    })
                .unbind("change")
                .bind("change",function(event){
                    if (browseris.ie===true){
                        event.stopImmediatePropagation();
                        window.onerror=handleError;
                    }
                    $.spff(o);
                });
                f.parents("td.ms-formbody:first").css(o.lockBkg);
            }
        });
    };
})();
/**
 * end closure
 */