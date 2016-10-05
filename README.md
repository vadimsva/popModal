popModal
========

This library includes 6 components:<br>
<b>popModal</b> - popup window, displayed near the parent element. Invoked by clicking on an element<br>
<b>notifyModal</b> - notification popup, displayed on top of all elements. Invoked by event and hide after a certain time<br>
<b>hintModal</b> - tooltip, displayed near the parent element. Invoked on mouse hover on an element and hide after element lost focus<br>
<b>dialogModal</b> - modal dialog for big content or collection of content, displayed on top of all elements. Invoked by clicking on an element<br>
<b>titleModal</b> - tooltip, displayed near the parent element, replace native title. Invoked on mouse hover on an element and hide after element lost focus<br>
<b>confirmModal</b> - modal dialog for alert or confirm content, displayed on top of all elements. Invoked by clicking on an element<br>

<i>For work required only jQuery, other libraries are not required.</i>
<br>

<a href="http://vadimsva.github.io/popModal/" target="_blank"><b>DEMO</b></a>


<h4>Direct links to libs</h4>
<a href="http://vadimsva.github.io/popModal/popModal.js" target="_blank"><b>popModal.js</b></a> [33.2Kb]<br>
<a href="http://vadimsva.github.io/popModal/popModal.min.js" target="_blank"><b>popModal.min.js</b></a> [17.4Kb]<br>
<a href="http://vadimsva.github.io/popModal/popModal.css" target="_blank"><b>popModal.css</b></a> [17.3Kb]<br>
<a href="http://vadimsva.github.io/popModal/popModal.min.css" target="_blank"><b>popModal.min.css</b></a> [16.3Kb]


Documentation
=============

<h3>popModal</h3>
<p><i>$(el).popModal({param1 : value1, param2 : value2, ...});</i></p>

<h5>Parameters</h5>
- <code><b>html</b></code> - static html, dinamic html, string, function (object, string, function). Use function if you want load content via ajax.<br>
Use: <code>el.append(html)</code>, <code>$(el).html()</code>, <code>'text'</code> or <code>function(){}</code><br>
- <code><b>placement</b></code> - popup position (string).<br>
Use: <code>'bottomLeft'</code> - default, <code>'bottomCenter'</code>, <code>'bottomRight'</code>, <code>'leftTop'</code>, <code>'leftCenter'</code>, <code>'rightTop'</code>, <code>'rightCenter'</code><br>
- <code><b>showCloseBut</b></code> - show/hide close button on popup (boolean).<br>
Use: <code>true</code> - default, <code>false</code><br>
- <code><b>onDocumentClickClose</b></code> - close popup when click on any place (boolean).<br>
Use: <code>true</code> - default, <code>false</code><br>
- <code><b>onDocumentClickClosePrevent</b></code> - prevent close popup when click on specified elements (string).<br>
Use: <code>el</code> or <code>'.el'</code><br>
- <code><b>overflowContent</b></code> - overflow content (boolean).<br>
Use: <code>false</code> - default, <code>true</code><br>
- <code><b>inline</b></code> - create popup relative element (boolean).<br>
Use: <code>true</code> - default, <code>false</code><br>
- <code><b>asMenu</b></code> - use popup for show as dropdown menu (boolean).<br>
Use: <code>false</code> - default, <code>true</code><br>
- <code><b>beforeLoadingContent</b></code> - show text, before loading content (string).<br>
Use: <code>'Please, waiting...'</code> - default<br>
- <code><b>onOkBut</b></code> - code execution by clicking on OK button, contained in popup (function).<br>
Use: <code>function(){}</code>.<br>
For work you need put an attribute to element - <code>data-popmodal-but="ok"</code>. <i>Popup will close automatically</i><br>
- <code><b>onCancelBut</b></code> - code execution by clicking on Cancel button, contained in popup (function).<br>
Use: <code>function(){}</code>.<br>
For work you need put an attribute to element - <code>data-popmodal-but="cancel"</code>. <i>Popup will close automatically</i><br>
- <code><b>onLoad</b></code> - code execution before popup shows (function).<br>
Use: <code>function(){}</code><br>
- <code><b>onClose</b></code> - code execution after popup closed (function).<br>
Use: <code>function(){}</code><br>
<br>

<h5>Methods</h5>
- <code><b>hide</b></code> - for close popModal.<br>
Use: <code>$('html').popModal("hide");</code><br>
<br>

<h5>Triggers</h5>
- <code><b>load</b></code> - execution before shows.<br>
Use: <code>$(el).on('load', function() {});</code><br>
- <code><b>close</b></code> - execution after closed.<br>
Use: <code>$(el).on('close', function() {});</code><br>
- <code><b>okbut</b></code> - execution by clicking on OK button.<br>
Use: <code>$(el).on('okbut', function() {});</code><br>
- <code><b>cancelbut</b></code> - execution by clicking on Cancel button.<br>
Use: <code>$(el).on('close', function() {});</code><br>
<br>

<h5>Notes</h5>
You may use external click function for element
<pre>
$(el).click(function(){
  $(el).popModal({param1 : value1, param2 : value2, ...});
});
</pre>
Use this, for immediately run popModal
<pre>
$(el).popModal({param1 : value1, param2 : value2, ...});
</pre>

Also you may use inline bind
<pre>
&lt;button id="elem" data-popmodal-bind="#content" data-placement="bottomLeft" data-showclose-but="true" data-inline="true" data-overflowcontent="false" data-ondocumentclick-close="true" data-ondocumentclick-close-prevent="e"&gt;example&lt;/button&gt;
</pre>

<i>Popup is dynamically created. When you create the second popup, the first will be deleted!</i><br>
<i>For create footer in popup, use element div with <code>class="popModal_footer"</code>. You can use attribute for element <code>data-popmodal-but="close"</code> for close popup, also you can press ESC, or click on any place.</i>


<br><br>


<h3>notifyModal</h3>
<p><i>$(content).notifyModal({param1 : value1, param2 : value2, ...});</i></p>

<h5>Parameters</h5>
- <code><b>duration</b></code> - duration for show notification in ms (integer)<br>
Use: <code>2500</code> - default, <code>-1</code> for infinity<br>
- <code><b>placement</b></code> - position (string).<br>
Use: <code>'center'</code> - default, <code>'leftTop'</code>, <code>'centerTop'</code>, <code>'rightTop'</code>, <code>'leftBottom'</code>, <code>'centerBottom'</code>, <code>'rightBottom'</code>, <code>'centerTopSlide'</code>, <code>'centerBottomSlide'</code>, <code>'leftTopSlide'</code>, <code>'leftBottomSlide'</code>, <code>'rightTopSlide'</code>, <code>'rightBottomSlide</code><br>
- <code><b>type</b></code> - visual style (string).<br>
Use: <code>'notify'</code> - default, <code>'alert'</code>, <code>'simple'</code>, <code>'dark'</code><br>
- <code><b>overlay</b></code> - show notification popup on top of the content (boolean).<br>
Use: <code>true</code> - default, <code>false</code><br>
- <code><b>icon</b></code> - show icon (boolean).<br>
Use: <code>false</code> - default, <code>true</code><br>
- <code><b>onClose</b></code> - code execution after popup closed (function).<br>
Use: <code>function(){}</code><br>

<h5>Triggers</h5>
- <code><b>close</b></code> - execution after closed.<br>
Use: <code>$(el).on('close', function() {});</code><br>
<br>

<h5>Notes</h5>
<i>You can close this notification popup, by clicking on any place, close button or press ESC.</i><br>


<br><br>


<h3>hintModal</h3>
<p><i>$('.hintModal').hintModal();</i></p>

Use: You need to create html with <code>class="hintModal"</code> as parent element and put in this element div with <code>class="hintModal_container"</code>, put here html, to be displayed.<br>
To change position, add additional class <code>class="hintModal_center"</code> or <code>class="hintModal_right"</code> to parent element.<br>

<h5>Notes</h5>
<i>hintModal will be called automatically if document have elements with the class "hintModal".</i>


<br><br>


<h3>dialogModal</h3>
<p><i>$(content).dialogModal({param1 : value1, param2 : value2, ...});</i></p>

<h5>Parameters</h5>
- <code><b>topOffset</b></code> - top offset for dialog, useful if some elements on page have position: fixed (integer, string).<br>
Use: <code>0</code> - default, <code>'10%'</code>.<br>
- <code><b>top</b></code> - top offset for dialog, uses for <code>type:'modal'</code> (integer, string).<br>
Use: <code>0</code> - default, <code>'10%'</code>.<br>
- <code><b>type</b></code> - type of dialog (string).<br>
Use: <code>''</code> - default, <code>'modal'</code> to show dialog not from top.<br>
- <code><b>onOkBut</b></code> - code execution by clicking on OK button, contained in dialog (function).<br>
Use: <code>function(){}</code>.<br>
For work you need put an attribute to element - <code>data-dialogmodal-but="ok"</code>. <i>Dialog will close automatically</i><br>
- <code><b>onCancelBut</b></code> - code execution by clicking on Cancel button, contained in dialog (function).<br>
Use: <code>function(){}</code>.<br>
For work you need put an attribute to element - <code>data-dialogmodal-but="cancel"</code>. <i>Dialog will close automatically</i><br>
- <code><b>onLoad</b></code> - code execution before dialog shows (function).<br>
Use: <code>function(el, current){}</code><br>
You can use parameters <code>el</code> and <code>current</code> for example to change html.<br>
- <code><b>onClose</b></code> - code execution after dialog closed (function).<br>
Use: <code>function(){}</code><br>
- <code><b>onChange</b></code> - code execution after dialog page change (function).<br>
Use: <code>function(el, current){}</code><br>
You can use parameters <code>el</code> and <code>current</code> for example to change html.<br>
<br>

<h5>Methods</h5>
- <code><b>hide</b></code> - for close dialogModal.<br>
Use: <code>$('html').dialogModal("hide");</code><br>
<br>

<h5>Triggers</h5>
- <code><b>load</b></code> - execution before dialog shows.<br>
Use: <code>$(el).on('load', function() {});</code><br>
- <code><b>close</b></code> - execution after dialog closed.<br>
Use: <code>$(el).on('close', function() {});</code><br>
- <code><b>okbut</b></code> - execution by clicking on OK button.<br>
Use: <code>$(el).on('okbut', function() {});</code><br>
- <code><b>cancelbut</b></code> - execution by clicking on Cancel button.<br>
Use: <code>$(el).on('close', function() {});</code><br>
- <code><b>change</b></code> - execution after dialog page change.<br>
Use: <code>$(el).on('change', function() {});</code><br>
<br>


<h5>Notes</h5>
You may use external click function for element
<pre>
$(el).click(function(){
  $(content).dialogModal({param1 : value1, param2 : value2, ...});
});
</pre>
or use
<pre>
$(content).dialogModal({param1 : value1, param2 : value2, ...});
</pre>

<i>Dialog is dynamically created. When you create the second dialog, the first will be deleted!</i><br>
<i>You need to create div elements with classes <code>class="dialogModal_header"</code> - for show header,
<code>class="dialogModal_content"</code> - for show content, and <code>class="dialogModal_footer"</code> - for show footer.</i><br>
<i>You can use attribute for element <code>data-dialogmodal-but="close"</code> for close dialog, also you can press ESC.</i>
<i>To show collection of content, like pages in one modal dialog, use class for this dialogs.</i>
<i>If you want to use collection of content, you can change content by clicking to arrows, or press left/right arrow on keayboard, or use attributes <code>data-dialogmodal-but="prev"</code> and <code>data-dialogmodal-but="prev"</code>.</i>


<br><br>


<h3>titleModal</h3>
<p><i>$('.titleModal').titleModal();</i></p>

Use: You need to put attribute title and <code>class="titleModal"</code>.<br>
titleModal will show by default at the bottom, to change position, put attribute <code>data-placement="top"</code>. You can use <code>top</code>, <code>left</code> or <code>right</code>.

<h5>Notes</h5>
<i>titleModal will be called automatically if document have elements with the attribute title and  "class='titleModal'".<br>
You can use another style for titleModal, add <code>class="light"</code> to element.</i>



<br><br>


<h3>confirmModal</h3>
<p><i>$(content).confirmModal({param1 : value1, param2 : value2, ...});</i></p>

<h5>Parameters</h5>
- <code><b>topOffset</b></code> - top offset for dialog, useful if some elements on page have position: fixed (integer, string).<br>
Use: <code>0</code> - default, <code>'10%'</code>.<br>
- <code><b>top</b></code> - top offset for dialog, uses for <code>type:'modal'</code> (integer, string).<br>
Use: <code>0</code> - default, <code>'10%'</code>.<br>
- <code><b>onOkBut</b></code> - code execution by clicking on OK button, contained in dialog (function).<br>
Use: <code>function(){}</code>.<br>
For work you need put an attribute to element - <code>data-confirmmodal-but="ok"</code>. <i>Dialog will close automatically</i><br>
- <code><b>onCancelBut</b></code> - code execution by clicking on Cancel button, contained in dialog (function).<br>
Use: <code>function(){}</code>.<br>
For work you need put an attribute to element - <code>data-confirmmodal-but="cancel"</code>. <i>Dialog will close automatically</i><br>
- <code><b>onLoad</b></code> - code execution before dialog shows (function).<br>
Use: <code>function(){}</code><br>
- <code><b>onClose</b></code> - code execution after dialog closed (function).<br>
Use: <code>function(){}</code><br>
<br>

<h5>Methods</h5>
- <code><b>hide</b></code> - for close confirmModal.<br>
Use: <code>$('html').confirmModal("hide");</code><br>
<br>

<h5>Triggers</h5>
- <code><b>load</b></code> - execution before shows.<br>
Use: <code>$(el).on('load', function() {});</code><br>
- <code><b>close</b></code> - execution after closed.<br>
Use: <code>$(el).on('close', function() {});</code><br>
- <code><b>okbut</b></code> - execution by clicking on OK button.<br>
Use: <code>$(el).on('okbut', function() {});</code><br>
- <code><b>cancelbut</b></code> - execution by clicking on Cancel button.<br>
Use: <code>$(el).on('close', function() {});</code><br>
<br>

<h5>Notes</h5>
You may use external click function for element
<pre>
$(el).click(function(){
  $(content).confirmModal({param1 : value1, param2 : value2, ...});
});
</pre>
or use
<pre>
$(content).confirmModal({param1 : value1, param2 : value2, ...});
</pre>

<i>Dialog is dynamically created. When you create the second dialog, the first will be deleted!</i><br>
<i>You need to create div elements with classes <code>class="confirmModal_content"</code> - for show content, and <code>class="confirmModal_footer"</code> - for show footer.</i><br>
<i>You can use attribute for element <code>data-confirmmodal-but="close"</code> for close dialog.</i>



Examples
========

<h3>popModal</h3>
<pre>
$(el).popModal({
  html : $(content).html(),
  placement : 'bottomLeft',
  showCloseBut : true,
  onDocumentClickClose : true,
  onDocumentClickClosePrevent : '',
  overflowContent : false,
  inline : true,
  asMenu : false,
  beforeLoadingContent : 'Please, waiting...',
  onOkBut : function(){},
  onCancelBut : function(){},
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
$(content).notifyModal({
  duration : 2500,
  placement : 'center',
  type : 'notify',
  overlay : true
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


<h3>dialogModal</h3>
<pre>
$(content).dialogModal({});
</pre>


<h3>titleModal</h3>
<pre>
&lt;div title="Title text" class="titleModal light" data-placement="bottom"&gt;Text&lt;/div&gt;
</pre>


<h3>confirmModal</h3>
<pre>
$(content).confirmModal({});
</pre>


License
=======

The MIT License (MIT)
