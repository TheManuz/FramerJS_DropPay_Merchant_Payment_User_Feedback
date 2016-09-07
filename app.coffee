# Project Info
# This info is presented in a widget when you share.
# http://framerjs.com/docs/#info.info

Framer.Info =
	title: "DropPay - Merchant selling interaction"
	author: "Emanuele Salamone"
	twitter: ""
	description: ""


#Module Imports
TextLayer = require 'TextLayer'

ViewController = require 'ViewController'

Pointer = require 'Pointer'

AndroidRipple = require 'androidRipple'

# Import file "DropPay Mockups - Android" (sizes and positions are scaled 1:3)
sketch = Framer.Importer.load("imported/DropPay Mockups - Android@3x")

Framer.Device.contentScale = 1

#Init amount textlayer
amount = sketch.vendita1_textfield_amount.convertToTextLayer()
amount.fontFamily = "Roboto"
amount.lineHeight *= 0.5
amount.fontSize *= 3
amount.fontWeight = 500 #Medium weight 
amount.autoSize = true

currency = sketch.vendita1_label_currency

typeAmount = (value) ->
	if (amount.text is 0)
		amount.text = value
	else
		commaIndex = amount.text.indexOf(",")
		if (commaIndex == -1 and value isnt ",")
			if  (amount.text.length <4)
				amount.text += value
		else
			if (amount.text.length < commaIndex + 3 or value is ",")
				amount.text += value
	amount.centerX()
	currency.x = amount.x + amount.width
	
deleteChar = () ->
	if (amount.text.length > 1)
		amount.text = amount.text.slice(0, -1)
	else
		amount.text = "0"
	amount.centerX()
	currency.x = amount.x + amount.width
	
amount.text = "0"

#Keypad initialization

merchantBlue = "#18A8F0"

#Numeric keys callback
for key in sketch.numeric_keypad.children
	do (key) ->
		key.onClick ->
			if (amount.text.length is 1 and amount.text.charAt(0) is "0")
				amount.text = key.name.charAt(1)
			else
				typeAmount(key.name.charAt(1))
		key.on(Events.Click, AndroidRipple.Ripple)
		key.rippleColor = merchantBlue

sketch.comma.on(Events.Click, AndroidRipple.Ripple)
sketch.comma.rippleColor = merchantBlue
sketch.comma.onClick ->
	if (amount.text.indexOf(",") == -1)
		typeAmount(",")
	
sketch.del.on(Events.Click, AndroidRipple.Ripple)
sketch.del.rippleColor = merchantBlue
sketch.del.onClick ->
	deleteChar()

#ViewController initializing
Views = new ViewController
    initialView: sketch.vendita1

sketch.navbar.bringToFront()

sketch.vendita1_button.onClick -> Views.androidPushIn(sketch.vendita2)

#Schermata 2 setup
for key in sketch.vendita2_bottomsheet_grid.children
	do (key) ->
		key.onClick -> Views.zoomIn(sketch.vendita3)
		
sketch.vendita2_back.onClick ->
	Views.back()

#Schermata 3 setup
circlePulse = null

avatar = new Layer
	width: Framer.Device.screen.width*0.618
	height: Framer.Device.screen.width*0.618
	backgroundColor: "white"
	borderRadius: 12
	shadowY: 8
	shadowBlur: 16
	shadowSpread: 4
	shadowColor: "rgba(0, 0, 0, 0.24)"
	superLayer: sketch.vendita3
	midX: sketch.vendita3_QRcode.midX
	midY: sketch.vendita3_QRcode.midY
avatar.placeBefore(sketch.vendita3_QRcode)

infoLabel = sketch.vendita3_label_info.convertToTextLayer()
infoLabel.fontFamily = "Roboto"
infoLabel.lineHeight *= 0.5
infoLabel.fontSize *= 3
infoLabel.fontWeight = 500 #Medium weight 
infoLabel.autoSize = true

circularMaskDiameter = 736*3
greenScreen = new Layer
	originX: 0.5
	originY: 0.5 
	width: circularMaskDiameter
	height: circularMaskDiameter
	backgroundColor: "rgb(126,211,33)"
	parent: sketch.vendita3
	borderRadius: "50%"
	clip: true
greenScreen.placeBefore(avatar)
greenScreen.states.add
	hidden:
		x: Framer.Device.screen.width*0.5
		y: Framer.Device.screen.height*0.5
		width: 0
		height: 0
	grown:
		x: (Framer.Device.screen.width-circularMaskDiameter)*0.5
		y: (Framer.Device.screen.height-circularMaskDiameter)*0.5
		width: circularMaskDiameter
		height: circularMaskDiameter

sketch.vendita3_check.setParent(greenScreen)
sketch.vendita3_check.center()

sketch.vendita3_check.states.add
	hidden:
		scale: 0
		x: -sketch.vendita3_check.width/2
		y: -sketch.vendita3_check.height/2
		
for layer in [sketch.vendita3_QRcode, infoLabel, avatar]
	do (layer) ->
		layer.states.add
			hidden:
				scale: 0
				opacity: 0
			
Views.onViewWillSwitch (oldView, newView) ->
	if newView is sketch.vendita3
		avatar.image = "images/avatar"+Utils.randomChoice([1..12])+".jpg"
		avatar.states.add
			default:
				scale: 1
				opacity: 1
		
		greenScreen.states.switchInstant("hidden")
		sketch.vendita3_check.states.switchInstant("hidden")
		sketch.vendita3_QRcode.states.switchInstant("hidden")
		avatar.states.switchInstant("hidden")
		infoLabel.states.switchInstant("default")
		sketch.vendita3_QRcode.states.switch("default", curve: "bezier-curve", curveOptions: [0.0, 0.0, 0.2, 1], time: 0.375)
		Utils.delay 4, ->
			sketch.vendita3_QRcode.states.switch("hidden", curve: "bezier-curve", curveOptions: [0.0, 0.0, 0.2, 1], time: 0.375)
			avatar.states.switch("default", curve: "bezier-curve", curveOptions: [0.0, 0.0, 0.2, 1], time: 0.375)
			infoLabel.text = "Attendi l'inserimento del PIN"
			infoLabel.centerX()
			
			dotContainer = new Layer
				backgroundColor: "transparent"
				width: 80+80+48
				y: avatar.maxY + 48
				parent: sketch.vendita3
			dotContainer.centerX()
			dotDefaultDuration = 0.225
			for i in [0..2]
				do (i) ->
					dot = new Layer
						backgroundColor: "white"
						width: 48
						height: 48
						borderRadius: 36
						x: (120 * i)
						scale: 0
						parent: dotContainer
					Utils.delay (dotDefaultDuration * i * 0.8), () ->
						zoomAnim = dot.animate
							properties:
								scale: 1
							curve: "bezier-curve"
							curveOptions: [0.4, 0.0, 0.2, 1]
							time: dotDefaultDuration
							delay: dotDefaultDuration
						zoomAnim.onAnimationEnd ->
							scaleAnim = dot.animate
								properties:
									scale: 0
								curve: "bezier-curve"
								curveOptions: [0.4, 0.0, 1, 1]
								time: dotDefaultDuration
							scaleAnim.onAnimationEnd ->
								zoomAnim.start()
								
			Utils.delay 6, ->
				sketch.vendita3_check.states.switch("default", curve: "bezier-curve", curveOptions: [0.0, 0.0, 0.2, 1], time: 0.425)
				greenScreen.states.switch("grown", curve: "bezier-curve", curveOptions: [0.0, 0.0, 0.2, 1], time: 0.425)
				#avatar.states.switch("hidden", curve: "bezier-curve", curveOptions: [0.0, 0.0, 0.2, 1], time: 0.375);
				infoLabel.text = "Pagamento effettuato"
				infoLabel.centerX()
				dotContainer.destroy()
			
Views.onViewDidSwitch (oldView, newView) ->
	if newView is sketch.vendita3
		circlePulse = new Layer
			name: "circlePulse"
			x: -560
			y: -155
			z: -1
			width: 2200
			height: 2200
			borderRadius: 1100
			backgroundColor: "rgba(255,255,255,1)"
			opacity: 1
			superLayer: sketch.vendita3
			scale: 0.44
		circlePulse.placeBehind(sketch.vendita3_QRcode)
		circlePulse.animate
			properties:
				scale: 1
				opacity: 0
			curve: "bezier-curve"
			curveOptions: [0.0, 0.0, 0.2, 1]
			repeat: 1
			time: 2
			
sketch.vendita3_close.onClick ->
	Views.back()
	circlePulse.destroy()


#Test directly the 3rd screen
#Views.androidPushIn(sketch.vendita3)
