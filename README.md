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
<p><i>popModal(<b>elem</b>, <b>html</b>, <b>params</b>, <b>okFun</b>, <b>cancelFun</b>, <b>onLoad</b>, <b>onClose</b>);</i></p>

<b>elem</b> - parent element, where popup will be placed (object) - <b>required</b><br>
Use: <b>el</b> or <b>$(el)</b><br>

<b>html</b> - static html, dinamic html or string (object, string) - <b>required</b><br>
Use: <b>el.append(html)</b>, <b>$(el).html()</b> or <b>'text'</b><br>

<b>params</b> - some parameters for popup (put parameters in <b>{}</b>):<br>
&nbsp;&nbsp;&nbsp;<b>placement</b> - popup position (string).<br>
&nbsp;&nbsp;&nbsp;Use: <b>'bottomLeft'</b> - default, <b>'bottomCenter'</b>, <b>'bottomRight'</b><br>

&nbsp;&nbsp;&nbsp;<b>showCloseBut</b> - show/hide close button on popup (boolean).<br>
&nbsp;&nbsp;&nbsp;Use: <b>true</b> - default, <b>false</b><br>

&nbsp;&nbsp;&nbsp;<b>overflowContent</b> - limit/no limit height of the content (boolean).<br>
&nbsp;&nbsp;&nbsp;Use: <b>true</b> - default, <b>false</b><br>

<b>okFun</b> - code execution by clicking on OK button, contained in popup (function).<br>
Use: <b>function(){}</b>.<br>
For work you need put an attribute to element - <b>data-popmodal="ok"</b>. <i>Popup will close automatically</i><br>

<b>cancelFun</b> - code execution by clicking on Cancel button, contained in popup (function).<br>
Use: <b>function(){}</b>.<br>
For work you need put an attribute to element - <b>data-popmodal="cancel"</b>. <i>Popup will close automatically</i><br>

<b>onLoad</b> - code execution before popup shows (function).<br>
Use: <b>function(){}</b><br>

<b>onClose</b> - code execution after popup closed (function).<br>
Use: <b>function(){}</b><br>

<i>Popup is dynamically created. When you create the second popup, the first will be deleted!</i><br>
<i>For create footer in popup, use element div with <b>class="popModal_footer"</b>. You can use attribute for element <b>data-popmodal="close"</b> for close popup, also you can press ESC, or click on any place.</i>



<h3>notifyModal</h3>
<p><i>notifyModal(<b>html</b>, <b>duration</b>);</i></p>

<b>html</b> - static html, dinamic html or string (object, string) - <b>required</b><br>
Use: <b>el.append(html)</b>, <b>$(el).html()</b> or <b>'text'</b><br>

<b>duration</b> - duration for show notification in ms (integer)<br>
Use: <b>2500</b> - default, <b>-1</b> for infinity<br>

<i>You can close this notification popup, by clicking on any place, by clicking on close button or press ESC.</i><br>




<h3>hintModal</h3>
<p><i>hintModal();</i></p>

You need to create html with <b>class="hintModal"</b> as parent element and put in this element div with <b>class="hintModal_container"</b>, put here html, to be displayed.<br>



Examples
========

<h3>popModal</h3>
<pre>
$(el).click(function(){
  popModal($(this), el2.html(), { placement : 'bottomLeft', showCloseBut : true, overflowContent : true },
    function(){
      alert('you click OK');
    },
    function(){
      alert('you click CANCEL');
    },
    function(){
      alert('before load');
    },
    function(){
      alert('after close');
    }
  );
});
</pre>


<h3>notifyModal</h3>
<pre>
notifyModal($(el), 2500);
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
