# do ->
# 	readUrlParameters()
# 	loadTaskState()
# 	loadUserData()
# 	loadStream()
# 	loadStateIntoInterface()
# 	initMap()
# 	initActMap()

# 	if $.browser.msie
# 		alert "IE Error."

# 	$(window).resize ->
# 		map?.Resize()
# 		setTimeout map?.SetCenter(map.GetCenter()), 1000

# 	prepareSearchBox()

# prepareSearchBox = ->
# 	$sb = $("#searchBox")
# 	$sb.bind 'keypress', ((e) ->
# 		code = e.keyCode
# 		if code == 13
# 			addSelect())

# 	$sb.focus ->
# 		if $sb.val() == emptyText
# 			$sb.val ''
# 			$sb.css 'color', 'gray'
# 	$sb.blur ->
# 		if $sb.val() == ''
# 			$sb.val emptyText
# 			$sb.css 'color', 'black'