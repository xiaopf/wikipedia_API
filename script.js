 $(document).ready(
      function(){
        //清空输入框，隐藏clear按钮
        $('.search_content').val('');
        $('.clear').hide();
        //设置搜索icon单机动作，隐藏该icon，搜索模块缓慢出现，搜索框获得焦点，隐藏clear按钮
        $('.sch').click(function(){
          $(this).hide();
          $('.search_container').fadeIn();
          $('.search_content').focus();
          $('.clear').hide();
        });
        //监听搜索框内容变化，来显隐clear按钮
        $('.search_content').on('input propertychange', function() {
            if($('.search_content').val()){
              $('.clear').show();
            }else{
              $('.clear').hide();
            }
        });
        // 设置clear按钮的操作，点击清除搜索框内容，并获得焦点
        $('.clear').click(function(){
          $('.search_content').val('').focus();
        });
        // 搜索框失去焦点，且框内内容为空时，恢复搜索icon，
        $('.search_content').blur(function(){
          if(!$('.search_content').val()){
            $('.search_container').hide();
            $('.sch').fadeIn();
          }
        });
        // 设置开关
        var on='';
        //全局监控回车键的按下 
        document.onkeydown=function(event){

            var search_things=$('.search_content').val();
            // 当搜索框内容非空，且按下的键是回车时执行后续操作
            if(search_things&&event.keyCode==13){

                $('.msg').hide();
                $('body').animate({paddingTop:'60px',});
                $('.search_content').blur();

                  // 异步请求wikipedia API的内容
                $.ajax({
                    // 请求链接，跨域的请求
                    url:'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&origin=*&gsrsearch='+search_things,
                    crossDomain:true,
                    type:'get',
                    dataType:'jsonp',
                    // 当请求成功之后，执行回调函数
                    success:function(data){
                      console.log(data);

                      var items=data.query.pages;
                      var i=0;

                      $.each(items, function(idx, obj) {
                        i++;
                        if (obj.thumbnail) {var src=obj.thumbnail.source;}else{var src='';}
                        var href='http://en.wikipedia.org/wiki/'+encodeURIComponent(obj.title);
                        $('.board').hide();
                        $('.board')[0].innerHTML+='<div class="res_items"><h3 class="link">'+i+'、'+'<a class="link" target=_blank href="'+href+'">'+obj.title+'</a></h3><p><img class="img" src="'+src+'"/>'+obj.extract+'</p></div>'
                      });

                      $('.board').slideDown(1500);
                      on=true;
                      // 一个请求完成后，当搜索框重新获得焦点的时候，清除结果，恢复搜索状态
                      $('.search_content').focus(function(){
                          if(on){
                            on=false;
                            $('.res_items').remove();
                            $('.msg').show();
                            $('.clear').hide();
                            $('body').animate({paddingTop:'300px',});
                            $('.search_content').val('').focus();                    
                          }
                      });

                      $('.search_content').val(search_things);
                      $('.clear').click(function(){
                         $('.search_content').val('').focus();
                      });
                        
                    }

                });
            }
        }; 
      });