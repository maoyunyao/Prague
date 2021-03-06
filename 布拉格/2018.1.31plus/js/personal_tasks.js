  var tasks=new Array();
  //任务数及每个任务的子项数
  var task_num=0;
  var sub_task_num=new Array();

 //获取个人任务信息
  function get_personal_tasks(value)
  {
	  tasks.splice(0,tasks.length);	//清空个人任务数组
	  task_num=0;
	  sub_task_num.splice(0,sub_task_num.length);//清空子项数量数组
	  document.getElementById('task_part').innerHTML="";//初始化任务部分
	   document.getElementById('task_title_part').innerHTML="";
	  var res={
				"state":"get_result",
				 "data":{
              "group_id":value,
						  "member":getCookie("username"),
						  "state":"2",
						  "order":"DESC",
						  "order_by":"start_date"
						}
			  };
	  var str=JSON.stringify(res);
	  //alert("向后端传入的json数据为"+str);
	  $.ajax({
             url: "php/search_tasks.php",
             type: "POST",
             data:{res:str},
			 dataType: "json",
             error: function(){
                 //alert('Error loading XML document');
             },
             success: function(data){
				if(data.success=="true"){
					//alert("查询个人任务成功！");
					for(var i=0;i<data.res.length;i++){
						tasks.push(data.res[i]);
					}
					//获取任务数及每个任务的子项数
					task_num=tasks.length;
					for(var i=0;i<task_num;i++)
					{
						if(tasks[i].subtasks!=undefined){
						sub_task_num[i]=tasks[i].subtasks.length;
						}else{
							sub_task_num[i]=0;
						}
					}
					//加载当前任务
					  init_task_part(task_num);
					  if(document.getElementById('task_part').innerHTML==""){
						document.getElementById('task_part').innerHTML=="目前还没任务，快去发布任务吧！"
						}
						total_task(task_num);
				}else{
					//如果查询任务记录为空
					if(data.error=="start_index exceeds number of rows")
					{
						document.getElementById('task_part').innerHTML="<div class='layui-text'>还没有任务呢,快去发布吧！</div>";
					}
					//alert(data.error);
				}
			}
		});
  }

/*******************************************************当前任务所用函数*********************************************************************/
/*
函数说明：初始化选项卡的当前任务模块
参数：任务数目
返回：无
*/
function init_task_part(task_num)
{
	for(var i=1;i<=task_num;i++)
	{
		add_task(i);
	}
}


/*
函数说明：添加一个当前任务及对应内容
参数：任务编号
返回：无
*/
function add_task(task_label)
{
		if(task_label===1)
	{
		$("#task_part").append("<div class='layui-tab-item layui-show ' id='task"+task_label+"'></div>");
	}
	else
	{
		$("#task_part").append("<div class='layui-tab-item ' id='task"+task_label+"'></div>");
	}
	add_task_title(task_label);
	add_task_content(task_label);
}


/*
函数说明：添加当前任务的名称
参数：任务编号
返回：无
*/
function add_task_title(task_label)
{
	if(task_label===1)
	{
		$("#task_title_part").append("<li class='layui-this'>任务"+task_label+"</li>");
	}
	else
	{
		$("#task_title_part").append("<li>任务"+task_label+"</li>");
	}
}


/*
函数说明：添加一个当前任务的内容
参数：任务编号
返回：无
*/
function add_task_content(task_label)
{

	var task_description_id="task"+task_label+"_description";
	$("#task"+task_label).append(
								 "<div style='position:relative;float:none'>"
								+	"<div class='layui-text' >任务名称:"+tasks[task_label-1].name+"</div>"
								+	"<a onclick="+"change_display('"+task_description_id+"');>"
								+		"<i class='layui-icon' style='font-size: 30px; color: #1E9FFF;'>&#xe63c;</i><span>任务详情</span>"
								+	"</a>"
								+	"<div class=' layui-text' id='task"+task_label+"_description' style='display:none;'>"
								+		"<div class='layui-timeline-title' >任务简介:"+tasks[task_label-1].introduction+"</div>"
								+		"<div class='layui-timeline-title' >开始日期:"+tasks[task_label-1].start_date+"  截止日期:"+tasks[task_label-1].end_date+"</div>"
								+		"<div class='layui-timeline-title' >"
								+       	"<i class='layui-icon' style='font-size: 30px; color: #FF5722;'>&#xe756;</i>"
								+			"参与成员："+tasks[task_label-1].members
								+		"</div>"
								+ 	"</div>"
								+"</div>"
								);

	add_progress_bar("task",task_label);

	$("#task"+task_label).append(
								 "<div class='layui-field-box' style='position:relative;'>"
										+"<p style='float:left;'>任务进展</p>     <p style='margin-right:40px;float:right;'>完成情况</p>"
										+"<br/>"
								+"</div>"
								);
	add_total_sub_task(task_label,sub_task_num[task_label-1]);
}
/*
函数说明：向一个当前任务的内容中添加所有子项及子项内容
参数：任务编号，子项数量
返回：无
*/

function add_total_sub_task(task_label,sub_task_num)
{
	$("#task"+task_label).append("<ul class='layui-timeline' id='task_list"+task_label+"'></ul>");
	for(var i=1;i<=sub_task_num;i++)
	{
		add_one_sub_task(task_label,i);
	}
	//alert(ok);
}


/*
函数说明：向一个当前任务的内容中添加一个子项及子项内容
参数：任务编号,待添加子项在此任务中的编号
返回：无
*/
function add_one_sub_task(task_label,sub_task_label)
{
	var sub_task_id="sub_task"+task_label+"-"+sub_task_label;
	var sub_task_content_id="sub_task"+task_label+"-"+sub_task_label+"_content";
	var face_id="face"+task_label+"-"+sub_task_label;
	var task_list_id="task_list"+task_label;
	$("#"+task_list_id).append(
										"<li class='layui-timeline-item'>"
											+"<a onclick="+"change_display('"+sub_task_content_id+"');><i class='layui-icon layui-timeline-axis'></i></a>"
											+"<div class='layui-timeline-content layui-text' >"
											+	"<span class='layui-timeline-title' id='"+sub_task_id+"'>子项"+sub_task_label
											+		   "<button onclick="+"finish_subtask_func('"+tasks[task_label-1].subtasks[sub_task_label-1].subtask_id+"') type='button'"
											+			"class='layui-btn layui-btn-xs' style='margin-left:15px;float:right'>"
											+			"确认完成"
											+		   "</button>"
											+	"</span>"
											+	"<i id='"+face_id+"' class='layui-icon' style='font-size: 20px; color: #1E9FFF;float:right'>&#xe60c;</i>"
											+	"<div id='"+sub_task_content_id+"' style='display:none'>"
											+		"<div class='layui-timeline-title' >子项名称："+tasks[task_label-1].subtasks[sub_task_label-1].name+ "</div>"
											+		"<div class='layui-timeline-title' >开始日期："+tasks[task_label-1].subtasks[sub_task_label-1].start_date+ "</div>"
											+		"<div class='layui-timeline-title' >截止日期："+tasks[task_label-1].subtasks[sub_task_label-1].end_date+ "</div>"
											+		"<div class='layui-timeline-title'>负责人："+tasks[task_label-1].subtasks[sub_task_label-1].members+"</div>"
											+	"</div>"
											+"</div>"
										+"</li>"
	 						   );
}


/*
函数说明：某个任务下所有子项完成情况及进度条的初始化
参数：任务编号
返回：无
*/
function total_sub_task(task_label)
{
	var sub_finish_num=0;
	var percent=0;
       for(var i=0;i<sub_task_num[task_label-1];i++)
	   {
		  var is_finished=tasks[task_label-1].subtasks[i].state;
	      change_one_face('face'+task_label+'-'+(i+1),is_finished);
		  if(is_finished==1)sub_finish_num++;
	   }
	   percent=sub_finish_num/sub_task_num[task_label-1];
	change_one_bar("task_bar"+task_label,(percent*100)+"%");
}

/*
函数说明：对所有任务的子项完成情况及进度条的初始化
参数：任务数目
返回：无
*/
function total_task(task_num)
{
		for(var i=1;i<=task_num;i++)
		{
		   total_sub_task(i);
		}
}



/********************************************当前任务和任务历史公用的函数****************************************************************************/
/*
函数说明：隐藏和显示内容，目前用于把timeline变成下拉列表
参数：被隐藏或显示的内容id
返回：无
*/
function change_display(id)
{
     var target=document.getElementById(id);
      if(target.style.display=="none"){
                target.style.display="block";
      }else{
                target.style.display="none";
    }
}


/*
函数说明：改变子项的完成/未完成状态（哭笑脸的转换）
参数：表情元素的id;是否完成（完成true，未完成false）
返回：无
*/
function change_one_face(id,finished)
{
  //alert(id);
       var target=document.getElementById(id);
	   if(finished==1)
	   {
	   target.innerHTML="&#xe60c;";
	   target.style="font-size: 20px; color: #1E9FFF;float:right;";
	   }
	   else
	   {
	   target.innerHTML="&#xe69c;";
	   target.style="font-size: 19px; color:#FF5722;float:right;";
	   }
}

/*
函数说明：向任务选项卡的内容中添加进度条
参数：前缀（当前任务对应task历史任务对应task_h），任务编号
返回：无
*/
function add_progress_bar(prefix,task_label)
{
	var task_bar_id=prefix+"_bar"+task_label;
	$("#"+prefix+task_label).append(
								"<!--进度条-->"
											+	"<div  style='margin-top:10px;margin-bottom:10px;position:relative;clear:left;' class='layui-progress layui-progress-big' id='" + task_bar_id + "' lay-filter='"+task_bar_id+"'  lay-showPercent='true'>"
											+	"	<div   class='layui-progress-bar layui-bg-red' lay-percent='100%'></div>"
											+	"</div>"
								);
}

/*
函数说明：改变某个进度条的进度
参数：进度条的id，任务进度（任务进度的完成子项数除以全部子项数）
返回：无
*/
function change_one_bar(task_bar_id,percent)
{
	layui.element.progress(task_bar_id, percent);
}
