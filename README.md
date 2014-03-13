popModal
========

This library includes 3 components:<br>
<b>popModal</b> - popup window, displayed near the parent element. Invoked by clicking on an element<br>
<b>notifyModal</b> - notification popup, displayed on top of all elements. Invoked by event and hide after a certain time<br>
<b>hintModal</b> - tooltip, displayed near the parent element. Invoked on mouse hover on an element and hide after element lost focus<br>

<i>For work required only jQuery, other libraries are not required.</i>


Documentation
=============

<h3>popModal</h3>
<p><i>$(el).popModal({param1 : value1, param2 : value2, ...});</i></p>

<h5>Parameters</h5>
<code>html</code> - static html, dinamic html, string, function (object, string, function). Use function if you want load content via ajax.<br>
Use: <code>el.append(html)</code>, <code>$(el).html()</code>, <code>'text'</code> or <code>function(){}</code><br>
<br>
<code>placement</code> - popup position (string).<br>
Use: <code>'bottomLeft'</code> - default, <code>'bottomCenter'</code>, <code>'bottomRight'</code>, <code>'leftTop'</code>, <code>'leftCenter'</code>, <code>'rightTop'</code>, <code>'rightCenter'</code><br>
<br>
<code>showCloseBut</code> - show/hide close button on popup (boolean).<br>
Use: <code>true</code> - default, <code>false</code><br>
<br>
<code>overflowContent</code> - limit/no limit height of the content (boolean).<br>
Use: <code>true</code> - default, <code>false</code><br>
<br>
<code>okFun</code> - code execution by clicking on OK button, contained in popup (function).<br>
Use: <code>function(){}</code>.<br>
For work you need put an attribute to element - <code>data-popmodal="ok"</code>. <i>Popup will close automatically</i><br>
<br>
<code>cancelFun</code> - code execution by clicking on Cancel button, contained in popup (function).<br>
Use: <code>function(){}</code>.<br>
For work you need put an attribute to element - <code>data-popmodal="cancel"</code>. <i>Popup will close automatically</i><br>
<br>
<code>onLoad</code> - code execution before popup shows (function).<br>
Use: <code>function(){}</code><br>
<br>
<code>onClose</code> - code execution after popup closed (function).<br>
Use: <code>function(){}</code><br>
<br>

<h5>Methods</h5>
<code>hide</code> - for close popModal.<br>
Use: <code>$(el).popModal("hide");</code><br>
<br>

<h5>Notes</h5>
You may use external click function for element
<pre>
$(el).click(function(){
  $(el).popModal({param1 : value1, param2 : value2, ...});
});
</pre>
or use
<pre>
$(el).popModal({param1 : value1, param2 : value2, ...});
</pre>

<i>Popup is dynamically created. When you create the second popup, the first will be deleted!</i><br>
<i>For create footer in popup, use element div with <code>class="popModal_footer"</code>. You can use attribute for element <code>data-popmodal="close"</code> for close popup, also you can press ESC, or click on any place.</i>



<h3>notifyModal</h3>
<p><i>notifyModal({param1 : value1, param2 : value2, ...});</i></p>

<h5>Parameters</h5>
<code>html</code> - static html, dinamic html or string (object, string) - <b>required</b><br>
Use: <code>el.append(html)</code>, <code>$(el).html()</code> or <code>'text'</code><br>
<br>
<code>duration</code> - duration for show notification in ms (integer)<br>
Use: <code>2500</code> - default, <code>-1</code> for infinity<br>
<br>
<code>placement</code> - position (string).<br>
Use: <code>'center'</code> - default, <code>'leftTop'</code>, <code>'centerTop'</code>, <code>'rightTop'</code>, <code>'leftBottom'</code>, <code>'centerBottom'</code>, <code>'rightBottom'</code><br>

<h5>Notes</h5>
<i>You can close this notification popup, by clicking on any place, close button or press ESC.</i><br>




<h3>hintModal</h3>
<p><i>hintModal();</i></p>

Use: You need to create html with <code>class="hintModal"</code> as parent element and put in this element div with <code>class="hintModal_container"</code>, put here html, to be displayed.<br>
To change position, add additional class <code>class="hintModal_center"</code> or <code>class="hintModal_right"</code> to parent element.<br>

<h5>Notes</h5>
<i>hintModal will be called automatically if document have elements with the class "hintModal".</i>



Examples
========

<h3>popModal</h3>
<pre>
$(el).popModal({
  html : $(content).html(),
  placement : 'bottomLeft',
  showCloseBut : true,
  overflowContent : true,
  okFun : function(){},
  cancelFun : function(){},
  onLoad : function(){},
  onClose : function(){}
});
</pre>
<pre>
$(el).popModal({
  html : function(callback) {
    $.ajax({url:'ajax.html'}).done(function(content){
      callback(content);
    });
  }
});
</pre>


<h3>notifyModal</h3>
<pre>
notifyModal({
  html : $(el).html(),
  duration : 2500,
  placement : 'center'
});
</pre>


<h3>hintModal</h3>

<pre>
&lt;div class="hintModal"&gt;
  hover on me
  &lt;div class="hintModal_container"&gt;
    text for hintModal
  &lt;/div&gt;
&lt;/div&gt;
</pre>


<a href="http://vadimsva.github.io/popModal/" target="_blank"><b>DEMO</b></a>


<h3>Direct links to libs</h3>
<a href="http://vadimsva.github.io/popModal/popModal.js" target="_blank"><b>popModal.js</b></a><br>
<a href="http://vadimsva.github.io/popModal/popModal.min.js" target="_blank"><b>popModal.min.js</b></a><br>
<a href="http://vadimsva.github.io/popModal/popModal.css" target="_blank"><b>popModal.css</b></a><br>
<a href="http://vadimsva.github.io/popModal/popModal.min.css" target="_blank"><b>popModal.min.css</b></a>

