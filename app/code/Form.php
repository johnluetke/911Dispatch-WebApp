<?php

if (!function_exists('__')) {
	function __($string) {
		$args = func_get_args();
		unset($args[0]);

		return $text;
	}
}

class FormConstructionException extends Exception {

	public function __construct($message, $user_message="") {
		parent::__construct($message);
	}
}

class Form {

	public static $cols = array();

	public static function getFields($mode='') {
		if ($mode == "json") {
			return json_encode(Form::getFields());
		}
		else {
			return Form::$cols;
		}
	}

	public static function parseGlobalAttributes($params) {

		extract($params);
	
		$str  = "";
		$str .= isset($accesskey) ? "accesskey=\"$accesskey\" " : "";
		$str .= isset($class) ? "class=\"$class\" " : "";
		$str .= isset($contenteditable) ? "contenteditable=\"$contenteditable\" " : "";
		$str .= isset($id) ? "id=\"$id\" " : "";
		$str .= isset($contextmenu) ? "contextmenu=\"$contextmenu\" " : "";
		$str .= isset($dir) ? "dir=\"$dir\" " : "";
		$str .= isset($draggable) ? "draggable=\"$draggable\" " : "";
		$str .= isset($hidden) ? "hidden=\"$hidden\" " : "";
		$str .= isset($lang) ? "lang=\"$lang\" " : "";
		$str .= isset($spellcheck) ? "spellcheck=\"$spellcheck\" " : "";
		$str .= isset($style) ? "style=\"$style\" " : "";
		$str .= isset($tabindex) ? "tabindex=\"$tabindex\" " : "";
		$str .= isset($title) ? "title=\"$title\" " : "";

		return $str;
	}

	public static function parseEventAttributes($params) {
	
		extract($params);
	
		$str  = "";
		$str .= isset($onabort) ? "onabort=\"$onabort\" " : "";
		$str .= isset($onblur) ? "onblur=\"$onblur\" " : "";
		$str .= isset($oncanplay) ? "oncanplay=\"$oncanplay\" " : "";
		$str .= isset($oncanplaythrough) ? "oncanplaythrough=\"$oncanplaythrough\" " : "";
		$str .= isset($onchange) ? "onchange=\"$onchange\" " : "";
		$str .= isset($onclick) ? "onclick=\"$onclick\" " : "";
		$str .= isset($oncontextmenu) ? "oncontextmenu=\"$oncontextmenu\" " : "";
		$str .= isset($ondblclick) ? "ondblclick=\"$ondblclick\" " : "";
		$str .= isset($ondrag) ? "ondrag=\"$ondrag\" " : "";
		$str .= isset($ondragend) ? "ondragend=\"$ondragend\" " : "";
		$str .= isset($ondragenter) ? "ondragenter=\"$ondragenter\" " : "";
		$str .= isset($ondragleave) ? "ondragleave=\"$ondragleave\" " : "";
		$str .= isset($ondragover) ? "ondragover=\"$ondragover\" " : "";
		$str .= isset($ondragstart) ? "ondragstart=\"$ondragstart\" " : "";
		$str .= isset($ondrop) ? "ondrop=\"$ondrop\" " : "";
		$str .= isset($ondurationchange) ? "ondurationchange=\"$ondurationchange\" " : "";
		$str .= isset($onemptied) ? "onemptied=\"$onemptied\" " : "";
		$str .= isset($onended) ? "onended=\"$onended\" " : "";
		$str .= isset($onerror) ? "onerror=\"$onerror\" " : "";
		$str .= isset($onfocus) ? "onfocus=\"$onfocus\" " : "";
		$str .= isset($onformchange) ? "onformchange=\"$onformchange\" " : "";
		$str .= isset($onforminput) ? "onforminput=\"$onforminput\" " : "";
		$str .= isset($oninput) ? "oninput=\"$oninput\" " : "";
		$str .= isset($oninvalid) ? "oninvalid=\"$oninvalid\" " : "";
		$str .= isset($onkeydown) ? "onkeydown=\"$onkeydown\" " : "";
		$str .= isset($onkeypress) ? "onkeypress=\"$onkeypress\" " : "";
		$str .= isset($onkeyup) ? "onkeyup=\"$onkeyup\" " : "";
		$str .= isset($onload) ? "onload=\"$onload\" " : "";
		$str .= isset($onloadeddata) ? "onloadeddata=\"$onloadeddata\" " : "";
		$str .= isset($onloadedmetadata) ? "onloadedmetadata=\"$onloadedmetadata\" " : "";
		$str .= isset($onloadstart) ? "onloadstart=\"$onloadstart\" " : "";
		$str .= isset($onmousedown) ? "onmousedown=\"$onmousedown\" " : "";
		$str .= isset($onmousemove) ? "onmousemove=\"$onmousemove\" " : "";
		$str .= isset($onmouseout) ? "onmouseout=\"$onmouseout\" " : "";
		$str .= isset($onmouseover) ? "onmouseover=\"$onmouseover\" " : "";
		$str .= isset($onmouseup) ? "onmouseup=\"$onmouseup\" " : "";
		$str .= isset($onmousewheel) ? "onmousewheel=\"$onmousewheel\" " : "";
		$str .= isset($onpause) ? "onpause=\"$onpause\" " : "";
		$str .= isset($onplay) ? "onplay=\"$onplay\" " : "";
		$str .= isset($onplaying) ? "onplaying=\"$onplaying\" " : "";
		$str .= isset($onprogress) ? "onprogress=\"$onprogress\" " : "";
		$str .= isset($onratechange) ? "onratechange=\"$onratechange\" " : "";
		$str .= isset($onreadystatechange) ? "onreadystatechange=\"$onreadystatechange\" " : "";
		$str .= isset($onscroll) ? "onscroll=\"$onscroll\" " : "";
		$str .= isset($onseeked) ? "onseeked=\"$onseeked\" " : "";
		$str .= isset($onseeking) ? "onseeking=\"$onseeking\" " : "";
		$str .= isset($onselect) ? "onselect=\"$onselect\" " : "";
		$str .= isset($onshow) ? "onshow=\"$onshow\" " : "";
		$str .= isset($onstalled) ? "onstalled=\"$onstalled\" " : "";
		$str .= isset($onsubmit) ? "onsubmit=\"$onsubmit\" " : "";
		$str .= isset($onsuspend) ? "onsuspend=\"$onsuspend\" " : "";
		$str .= isset($ontimeupdate) ? "ontimeupdate=\"$ontimeupdate\" " : "";
		$str .= isset($onvolumechange) ? "onvolumechange=\"$onvolumechange\" " : "";
		$str .= isset($onwaiting) ? "onwaiting=\"$onwaiting\" " : "";

		return $str;
	}

	public static function makeTextArea($params) {
		extract($params);
		// we require a name
		if (!isset($name)) throw new FormConstructionException("Form::makeTextArea() requires a name");
		
		if (!isset($id)) { $params['id'] = $name; $id = $name; }
		$params['class'] .= " rounded-10";

		$str  = "<textarea name=\"$name\" ";
		
		// global attributes
		$str .= Form::parseGlobalAttributes($params);

		// event attributes
		$str .= Form::parseEventAttributes($params);

		// textarea specific	
		$str .= isset($rows) ? "rows=\"$rows\" " : "";
		$str .= isset($cols) ? "cols=\"$cols\" " : "";
		$str .= isset($disabled) ? "disabled=\"$disabled\" " : "";
		$str .= isset($readonly) ? "readonly=\"$readonly\" " : "";
		$str .= isset($required) ? "required=\"required\" " : "";
		$str .= isset($form) ? "form=\"$form\" " : "";
		$str .= isset($maxlength) ? "maxlength=\"$maxlength\" " : "";
		$str .= isset($autofocus) ? "autofocus=\"$autofocus\" " : "";
		$str .= isset($placeholder) ? "placeholder=\"$placeholder\" " : "";
		$str .= isset($wrap) ? "wrap=\"$wrap\" " : "";
		$str .= isset($cols) ? "cols=\"$cols\" " : "";

		$str .= ">";
		$str .= isset($value) ? $value : "";
		$str .= "</textarea>";

		$str .= isset($label) ? "<label for=\"".$name."\">".$label."</label>" : "";

		return $str;

	}

	public static function makeInput($params) {

		// we require name
		if (!isset($params['name'])) throw new FormConstructionException("Form::makeInput() requires name");
		// default type
		if (!isset($params['type'])) $params['type'] = "text";
		// this method doesnt support radio or checkbox
		if ($params['type'] == "radio" || $params['type'] == "checkbox")
			throw new FormConstructionException("Form::makeInput does not support types \"radio\" or \"checkbox\"");
	
		if ($type == "range") {
			if (!isset($params['step'])) throw new FormConstructionException("Form::makeRange() requires step");
			if (!isset($params['min'])) throw new FormConstructionException("Form::makeRange() requires min");
			if (!isset($params['max'])) throw new FormConstructionException("Form::makeRange() requires max");
		}

		if (!isset($params['id'])) $params['id'] = $params['name'];
		$params['class'] .= " rounded-10";
	
		// handle the required attribute in browsers that dont support it
		if (isset($params['required'])) $params['class'] .= " required";
	
		extract($params);
	
		$str = "<input type=\"$type\" name=\"$name\" ";
	
		// global attributes
		$str .= Form::parseGlobalAttributes($params);

		// event attributes
		$str .= Form::parseEventAttributes($params);

		// input-specific
		$str .= isset($value) ? "value=\"$value\" " : "";	
		$str .= ($disabled == "true") ? "disabled=\"true\" " : "";
		$str .= ($readonly == "true") ? "readonly=\"true\" " : "";
		$str .= isset($required) ? "required=\"required\" " : "";
		$str .= isset($form) ? "form=\"$form\" " : "";
		$str .= isset($maxlength) ? "maxlength=\"$maxlength\" " : "";
		$str .= isset($autofocus) ? "autofocus=\"$autofocus\" " : "";
		$str .= isset($placeholder) ? "placeholder=\"$placeholder\" " : "";
		$str .= isset($size) ? "size=\"$size\" " : "";
		$str .= isset($autocomplete) ? "autocomplete=\"$autocomplete\" " : "";
		$str .= isset($pattern) ? "pattern=\"$pattern\" " : "";
		$str .= isset($list) ? "list=\"$list\" " : "";
		$str .= isset($step) ? "step=\"$step\" " : "";
		$str .= isset($min) ? "min=\"$min\" " : "";
		$str .= isset($max) ? "max=\"$max\" " : "";

		$str .= " />";

		$str .= isset($label) ? "<label for=\"".$name."\">".$label."</label>" : "";
		
		return $str;
	}

	public static function makeRadioGroup($params) {
		// we require name, values, and labels for values
		if (!isset($params['name'])) throw new FormConstructionException("Form::makeRadioGroup() requires a name");
		else if (!isset($params['values']) || !is_array($params['values']) || sizeof($params['values']) == 0) throw new FormConstructionException("Form::makeRadioGroup() requires an array of values");
		else {
			if (!isset($params['id'])) $params['id'] = $params['name'];
			extract($params);

			$str = "<div id=\"radiogroup-".$id."\" class=\"auto-radio-group\">";
			$str .= "<div class=\"options\">";
			
			foreach ($values as $value) {

				if (!is_array($value)) {
					throw new FormConstructionException("Form::makeRadioGroup(): an element in the value array was not an array.");
				}
				else {
					$str .= "<input type=\"radio\" name=\"".$name."\" value=\"".$value['value']."\" ";
					$str .= Form::parseGlobalAttributes($params);
					$str .= Form::parseEventAttributes($params);
					$str .= isset($value['checked']) ? "checked " : "";
					
					$str .= "/>".$value['label'];//;<label for=\"".$id."\">".$value['label']."</label>";
					$str .= (isset($newline)) ? "<br/>" : "";
				}
			}

			$str .= "</div>";

			$str .= isset($label) ? "<label for=\"".$name."\">".$label."</label>" : "";

			$str .= "</div>";

			return $str;
		}
	}

	public static function makeCheckbox($params) {
		// we require name && label
		if (!isset($params['name']) || !isset($params['label'])) throw new FormConstructionException("Form::makeCheckbox() requires name and label");
		if (!isset($params['id'])) $params['id'] = $params['name'];

		extract($params);

		$str =  "<input type=\"checkbox\" name=\"$name\"";

		// global attributes
		$str .= Form::parseGlobalAttributes($params);

		// event attributes
		$str .= Form::parseEventAttributes($params);

	 	$str .= ($checked == "true") ? "checked=\"".$checked."\" " : "";

		return $str."/>".$label;
	}

	public static function makeDropdown($params, $values) {
		// we require name
		if (!isset($params['name'])) throw new FormConstructionException("Form::makeDropdown() requires name");
		if (!isset($params['id'])) $params['id'] = $params['name'];

		extract($params);

		$str  = "<select name=\"$name\" ";
		$str .= Form::parseGlobalAttributes($params);
		$str .= Form::parseEventAttributes($params);

		// select-specific attributes
		$str .= (isset($disabled) && $disabled) ? "disabled=\"$disabled\" " : "";
		$str .= isset($form) ? "form=\"$form\" " : "";
		$str .= isset($size) ? "size=\"$size\" " : "";
		$str .= isset($multiple) ? "multiple=\"$multiple\" " : "";
		$str .= isset($required) ? "required=\"true\" " : "";
		$str .= " >";
		$str .= ($default) ? "<option value=\"\">".__('Please Select...', false)."</option>" : "";


		foreach ($values as $value=>$text) {
			if (is_array($text)) {
				$str .= Form::parseOptgroup($text, $selected);
			}
			else {
				$str .= "<option value=\"$value\" ".(($value == $selected) ? "selected=\"true\"" : "").">".$text."</option>";
			}
		}

		$str .= "</select>";

		$str .= isset($label) ? "<label for=\"".$name."\">".$label."</label>" : "";

		return $str;
	}

	private static function parseOptgroup($array, $selected) {
		
		$str = "<optgroup label=\"".$array['name']."\">";

		foreach ($array['options'] as $k=>$v) {
			if (is_array($v)) {
				$str .= Form::parseOptgroup($v, $selected);
			}
			else {
				$str .= "<option value=\"".$k."\" ".(($k == $selected) ? "selected=\"true\"" : "").">".$v."</option>";
			}
		}
		
		$str .= "</optgroup>";

		return $str;
	}
}
?>
