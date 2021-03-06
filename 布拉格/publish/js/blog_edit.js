//日志编辑 包括更新和删除
var edit_blog_i=0;

//改变目标元素的disabled属性
function change_disabled(target_id)
{
	var target=document.getElementById(target_id);
	if(target.style.disabled){
		target.style.disabled=false;
	}else{
		target.style.disabled=true;
	}
}

//编辑按钮被点击，触发编辑事件
function edit_form_edit(blog_i)
{
	one_button_change("form_edit");
	one_button_change("return");
	change_display('blog_show');
	change_display('blog_edit');
}
//取消按钮被点击，返回预览
function edit_form_undo()
{
	one_button_change("form_edit");
	one_button_change("return");
	change_display('blog_show');
	change_display('blog_edit');
}
//提交按钮被点击，提交修改并刷新
function edit_form_sumit()
{
	        
//表单验证部分
/////////////////////////////////////////////////////////////////////////////////        
            var form_theme=document.forms["log_edit_form"]["log_edit_title"].value;
			if(form_theme==""||form_theme==null)
            {
                layer.msg("日志主题不能为空");
                return false; 
            }
            if(form_theme.length>32)
            {
                layer.msg("日志主题不能多于32个字符");
                return false; 
            }
            if(!isNaN(form_theme))
            {
                layer.msg("日志主题不能为纯数字");
                return false; 
            }        
            if( filterSqlStr(form_theme))
            {  
                layer.msg("日志主题中包含了敏感字符"+sql_str()+",请重新输入！");  
                return false;  
            } 
            
            
            
            var form_content=layui.layedit.getContent(log_show_index);
            if(form_content.length>4096)
            {
                layer.msg("日志内容至多可含4096个字符");
                return false; 
            }       
            if( filterSqlStr(form_content))
            {  
                layer.msg("日志内容中包含了敏感字符"+sql_str()+",请重新输入！");  
                return false;  
            }      
/////////////////////////////////////////////////////////////////////////////////        
//表单验证部分结束                
			var temp={"state":"update_blog","data":{"blog_id":blog_id[edit_blog_i],"name":form_theme,"content":form_content}};
			var str=JSON.stringify(temp);
			//alert("提交修改请求的json："+str);
			$(function(){
				$.ajax({ 
						url: "php/uploadblog.php",  
						type: "POST", 
						data:{res:str}, 
						dataType: "json", 
						error: function(){   
											//alert('Error loading XML document');   
										 },   
						success: function(data){
										if(data.success=="true"){
																layer.msg("操作成功！");
															}else{
																	//alert(data.error);
																 }
												} });
										get_blogs();//提交修改后进行刷新
										$("#form_undo").click();
										$("#return").click();
						}); 
}

//删除按钮被点击，提交删除请求并刷新
function blog_delete()
{
	layer.open({
		  content: '真的要删除这篇日志吗？'
		  ,btn: ['确认', '取消']
		  ,yes: function(index, layero){
			  
								//按钮【按钮一】的回调
								var temp={"state":"delete_blog","data":{"blog_id":blog_id[edit_blog_i]}};
								var str=JSON.stringify(temp);
								//alert("提交删除请求的json："+str);
								$.ajax({ 
										url: "php/uploadblog.php",  
										type: "POST", 
										data:{res:str}, 
										dataType: "json", 
										error: function(){   
															//alert('Error loading XML document');   
														 },   
										success: function(data){
														if(data.success=="true"){
																				get_blogs();//提交删除后进行刷新
																				layer.msg("删除日志成功！");
																			}else{
																				//	alert(data.error);
																				 }
																} });
														layer.close(index);
														$("#form_undo").click();
														$("#return").click();
		  }
		  ,btn2: function(index, layero){
			//按钮【按钮二】的回调
			
			//return false 开启该代码可禁止点击该按钮关闭
		  }
		  ,cancel: function(){ 
			//右上角关闭回调
			
			//return false 开启该代码可禁止点击该按钮关闭
		  }
		});
	
}