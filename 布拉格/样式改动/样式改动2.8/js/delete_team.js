    function delete_team()
    {
        if(current_group_id==null)
        {
            alert("请先选择团队再执行该操作！");
            return false;
        }


        // data change into json
        var temp_data={"state":"delete_group","data":{"group_id":current_group_id}};
        var res=JSON.stringify(temp_data);


        //for debug,output the json object
        //alert(res);


        //ajax connect part
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "php/group.php" ,
            data: {res:res},
            success: function (data) {
            //deal with data from back_end
            if(data.success == "true"){
                alert('该团队已成功解散');
                current_group_id=null;//当前团队的全局变量置null
                current_members=[];//当前成员的全局变量置null
                team_init();//删除当前团队后，刷新侧边栏团队信息
                fresh_team_info(null);//当前团队的全局变量置null后，用null去刷新页面内容
            }
            else {
                //alert(data.error);
            }
            },
            error : function() {
           // alert("数据请求异常");
            }
        });
    }
