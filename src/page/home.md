---
eleventyNavigation:
  key: Home
  order: 0
page:
  class: home
permalink: /
---

After a lot of research, I landed on building a 12 volt system. A 24 or 48 volt system could've been cheaper, but a majority of battery operated systems (currently) run on 12V. Since this system is built as an emergency contigency, if it comes to it - it'd be easier scavenging 12V parts.

Some of the pictures don't align with the order of the below instructions. There may be some extra items missing or included in the images and I'll try to clarify any inconsistencies if they're pertinent to the build.

1. I designed how things would be wired up using [draw.io](https://app.diagrams.net/) (aka <code>app.diagrams.net</code>), then eventually switched over to their [Desktop app](https://github.com/jgraph/drawio-desktop/releases). [Here's the final diagram file](/imgs/diagram/solar-generator-wiring-diagram.drawio) in case you want to modify it.
    :::_ .imgs
    {% imgPopUp 'mani:imgs/diagram/solar-generator-wiring-diagram', 'Wiring diagram' %}
    :::
1. Charge each battery individually to 100%. This is so that when you wire the batteries together the voltage is the same which protects the consistency of the batteries cells. Significant voltage differences between batteries can cause damage or uneven wear when connected together.
1. Wire batteries in parallel. Used a 1/2" socket wrench to tighten. For wires with curves, try to gently pull them in the curve shape while tightening, otherwise they'll go whatever direction you're tightening.
1. I used a fabric measuring tape to get rough measurements for cables and wires. Basically I was imagining where components would be and I'd run the tape along the route a cable or wire would go. Then it was a matter of cutting, crimping, soldering, taping, and heat-gunning until I had my completed cables/wires.<br />
    A lot of the components didn't have manuals or wiring diagrams, so I'm including them here to save you the headache.
    :::_ .imgs
    {% imgPopUp 'mani:imgs/diagram/shunt-wiring', 'Shunt wiring' %}
    {% imgPopUp 'mani:imgs/diagram/temp-sensor-diagram', 'Temp. sensor wiring' %}
    {% imgPopUp 'mani:imgs/diagram/temp-sensor-manual', 'Temp. sensor manual' %}
    {% imgPopUp 'mani:imgs/diagram/ext-plug-wiring-01', 'Ext. plug wiring 01' %}
    {% imgPopUp 'mani:imgs/diagram/ext-plug-wiring-02', 'Ext. plug wiring 02' %}
    {% imgPopUp 'mani:imgs/diagram/nema-5-15r-receptacle-wiring', 'Nema 5-15R receptacle wiring' %}
    {% imgPopUp 'mani:imgs/diagram/4-socket-panel-wiring', ' 4-in-1 panel wiring' %}
    :::
1. I verified everything was getting power and running correctly before I started assembly. Not everything at once, but I checked cables/wires were pulling from the battery array and that wires weren't shorting or getting hot under load.
    :::_ .imgs
    {% imgPopUp 'mani:imgs/build/01-build', 'build step 01' %}
    {% imgPopUp 'mani:imgs/build/02-build', 'build step 02' %}
    {% imgPopUp 'mani:imgs/build/03-build', 'build step 03' %}
    :::
1. Trim out misc. ribs from inside of the case. This is so components can be placed and fitted without issue. You may notice notches cut out of the cutting board (in later pictures) which was to account for the rear and front ribs. The image doesn't show it, but I also trimmed some teeth/pegs coming off the center of the lid since they were hitting the Inverter.
    :::_ .imgs
    {% imgPopUp 'mani:imgs/build/04-build', 'build step 04' %}
    :::
1. Cut holes for the fans. The top of the exterior fan cover should align with the 6th indent line front the bottom on the front corner of the case. Drill pilot holes slightly larger than the screws since the covers have slight mounds that the screws sit in. Then cut out a square that sits about 1/8" within the 4 screw holes. You'll also have to trim off part of a side rib for things to fit.
1. Cut holes for the front panel components.
    :::_ .imgs
    {% imgPopUp 'mani:imgs/build/05-build', 'build step 05' %}
    {% imgPopUp 'mani:imgs/build/06-build', 'build step 06' %}
    :::
1. Mount fans by screwing the metal mesh cover from outside the case to the fan that's inside the case. The fan on the left is blowing out, and the one on the right is sucking in (there'll be arrows indicating the air direction on the side of the fan). I also made sure to place the corner of the fan where the power wires come out, at the bottom of the case facing the front.
1. Mount bus bars. Throughout the build I use the indentations of the case to get things in symetrical positions. For the bars, there were inner blocks near the rear for the wheel wells. I sat a bus bar on that and pushed it against the rear corner to get it square, then I marked where I needed to drill the pilot holes for the bolts.
    :::_ .imgs
    {% imgPopUp 'mani:imgs/build/07-build', 'build step 07' %}
    :::
1. Mount circuit breaker. It sits right under the left handle indent.
1. Wire from fuse to breaker (**make sure breaker is off**), and breaker to positive bus bar. On the breaker terminal that goes to the bus bar, make sure to add the shunt's wire before tightening. The bottom connection will go to the positive of the battery. At the end of that cable you'll need to fasten the 300A fuse.
    :::_ .imgs
    {% imgPopUp 'mani:imgs/build/08-build', 'build step 08' %}
    {% imgPopUp 'mani:imgs/build/09-build', 'build step 09' %}
    :::
1. Mount the shunt. May want to insert the little wire (from the breaker) into the bottom slot of the shunt before mounting since it can be tough to get in.
1. Wire from negative terminal to `B-` on shunt, then `P-` to negative bus bar (required an 11/16" socket wrench). The cable you make should have one 5/16" lug (to the bus bar) and an 11/16" lug (to the shunt).
    :::_ .imgs
    {% imgPopUp 'mani:imgs/build/10-build', 'build step 10' %}
    :::
1. Create 2 cardboard spacers for the bottom left and right indents of the case - without them the batteries won't sit evenly. I cut 3 pieces of cardboard from boxes that parts were shipped in. The spacers consist of 3 layers of cardboard each cut to the shape of the interior and then taped/sandwiched together with double-sided tape.
1. When testing components, I found that the heating pad performed the best with a layer of a teflon sheet (cut to size) over the adhesive area, and then tinfoil over teflon sheet. With the foil, the heat was distributed more evenly and without hotspots. The teflon sheet was to have something more sturdy to adhere to.
1. Place left/right bottom cardboard spacers, then the heating pad (wires facing the right side corner of the case), and then another teflon sheet (cut to size).
1. I had to make 2 extension cable/AC recepticles. The plug of the cable plugs into the Inverter, and the AC recepticle is mounted to the front. Mount the recepticles, and make sure all wires are tight and there are no stray strands of wire protruding from any sockets.
1. Mount the Anderson recepticles, and wire to the proper bus bars.
1. Mount the 2-way switches and their temperature control panels. Connect the temp. control panels to their corresponding components (fans and heating pad).
1. Mount the battery monitor. Plug the wire into the monitor and then the shunt.
1. Mount the 4-in-1 panel. The connecting of it's wiring happens at the end to ensure it doesn't cause any tangling issues or get damaged.
1. I cut some foam from that packaging that the batteries were shipped in. It's squishy when pressed from one side but stiff when pressed from the other. The stiff side will be facing the batteries once they're inserted. I secured the foam blocks with some double-sided tape. I would've preferred the left block to be up more (like the right side), but there wasn't room when the Inverter cables were in place.
1. For the red bus bar, here's what cables are connected (some aren't wired to components yet) in order from top to bottom:<br />
    (1) Inverter, (2) Battery, (3) Chargers (Anderson connectors for Solar & AC), (4) Cooling switch, heating switch, and 4-in-1 panel.
    :::_ .imgs
    {% imgPopUp 'mani:imgs/build/11-build', 'build step 11' %}
    :::
1. For the black bus bar, here's what cables are connected (some aren't wired to components yet) in order from top to bottom (sorry about the image quality):<br />
    (1) Shunt, (2) Chargers (Anderson connectors for Solar & AC), (3) Inverter, (4) Cooling switch, heating switch, and 4-in-1 panel.
    :::_ .imgs
    {% imgPopUp 'mani:imgs/build/12-build', 'build step 12' %}
    :::
1. Now that things are connected and wired to the bus bar, mount the bus bar covers.
    :::_ .imgs
    {% imgPopUp 'mani:imgs/build/13-build', 'build step 13' %}
    {% imgPopUp 'mani:imgs/build/14-build', 'build step 14' %}
    :::
1. Move cables/wires to the sides or over the external edges of the box to make room for inserting the batteries. Be careful of the lid, because it could slam shut and damage those dangling wires.
1. Insert batteries. Be very careful of wires, especially the fragile shunt wires. Place one at a time, I did from right to left (3, 2, 1). I place silicone sleeves over the cable terminals when the batteries aren't connected (to prevent wires swinging in, touching each other, and causing a short), so remove the sleeve and battery terminal caps only when wiring up each terminal. Once wired, the sleeves remain off, but I put the terminal caps on while I'm working (they'll come off when the Inverter goes in).
    - Wire red 1 to 2, and 2 to 3. When going from one to the other, the start cable terminal is on the bottom, and the end terminal sits on top of the next cable terminal. Be sure to wire the breaker/fuse to terminal 1.
    - Wire black 1 to 2, and 2 to 3. Be sure to wire the shunt to terminal 3. I placed the shunt terminal on the bottom since the shunt is slightly lower than the battery.
    - This was a test-fit image, before I had everything in order.
        :::_ .imgs
        {% imgPopUp 'mani:imgs/build/15-build', 'build step 15' %}
        :::
1. Remove the battery terminal caps, and place a teflon sheet over the battery. There should be slot on the right for the Inverter cables, a notch in the front left for the 4-in-1 red wire and for access to the breaker, and a notch in the front right for the cable bundle containing the 2 extension cords and wires for the Solar Charge Controller.
    :::_ .imgs
    {% imgPopUp 'mani:imgs/build/16-build', 'build step 16' %}
    :::
1. The configuration I finally landed on for the Inverter/Charge Controller platform (cutting board), was:
    - Two long rails cut out the left side for the battery terminals. Without these, the platform added barely enough thickness so that the lid wouldn't close. The Inverter is slightly raised in the middle, so when it's mounted it doesn't touch the battery terminals.
    - Two teeth with screw mounts along those cut out rail for the rear of the Inverter to mount on.
    - A front left cut out for access to the circuit breaker.
    - A front right cut out for the cable bundle.
    - 3 screw mounts for the Solar Charge Controller.
1. With the Solar Charge Controller mounted, place the platform over the batteries. I had to insert it at an angle due to the 4-in-1 panel terminals. Wire up the Solar Charge Controller, and then the 4-in-1 panel.
    :::_ .imgs
    {% imgPopUp 'mani:imgs/build/17-build', 'build step 17' %}
    :::
1. Mount Inverter to platform. Wire up the red and black terminals.
    - If you're working with a live battery (circuit breaker is on - which I don't recomend), before connecting the black terminal, wrap a resistor to the empty black cable end and bridge the connection to the Inverter with the other end of the resistor. Count to ten, remove the resistor, then attach the cable to the terminal (look away when touching the cable to the terminal in case a spark is thrown). This will pre-charge the capacitors to prevent the influx of electricity that causes a spark to occur. I had mixed results with the approach, but am mentioning it in case it's helpful.
1. Plug the extension cables into the Inverter.
1. Make sure the Inverter is in the Off position (`O` should be pressed in, `|` should be out).
1. Turn the circuit breaker to the On position, looking away from the system in case there are any sparks.
1. The battery monitor screen should power on.
    - Press Ok button (so screen becomes active), then hold Ok for 3 seconds to enter settings). Use the Up/Down arrows to navigate to a row, Ok to start editing, Up/Down to change value, Ok to accept change and move to next number, Back to exit editing, Back again to exit settings. 
      ```clike
         CAP: 0300.0 Ah
      Full V:  013.7 V
      Zero V:  010.0 V
      PowOff:  000.0 V
       Alarm:  000.0 Ah
       Atten:  0.000 %
      ```
      `CAP` is the capacity (so all 3 100AH batteries added)(100% for lithium, 50% for acid).<br />
      `Full V` (aka Nominal Voltage) and `Zero V` (aka Fully Discharged Voltage) may be called out in manual, but I had to look up "voltage chart lifepo4 12.8v battery" to get [some charts](https://www.google.com/search?q=voltage+chart+lifepo4+12.8v+battery) that seemed to line up with the initial number I was seeing.<br />
      `PowOff` shuts off monitor, 11v is roughly 5% charge left. `Alarm` heard it's annoying, skipping.<br />
      `Atten` adjusts the numbers by this percentage which is based on battery charge cycles and AH, skipping.
   - Hold the Up arrow on the monitor for 3 seconds to set monitor at 100% (only if the batteries are fully charged).
1. The app for the Solar Charge Controller requires some configuration:
   - Install the `VictronConnect` app.
   - Make sure the controller has power (steady or blinking light).
   - Make sure Bluetooth and Location are enabled on your mobile device.
   - Go into the Bluetooth list on your device and there should be a listing for `SmartSolar`. It'll ask for a pin during the first connect, the default is `000000`.
   - Open the app and your device should be there. The first time you try to connect, it may prompt to update firmware (did it twice for me). Only takes a few minutes.
   - Once connected, it'll prompt to change the pin (change it to whatever 6 digit number you prefer).
1. Turn on the Inverter, 4-in-1, and Cooling/Heating switches to ensure things are functioning as expected.
    :::_ .imgs
    {% imgPopUp 'mani:imgs/build/18-build', 'build step 18' %}
    {% imgPopUp 'mani:imgs/build/19-build', 'build step 19' %}
    {% imgPopUp 'mani:imgs/build/20-build', 'build step 20' %}
    {% imgPopUp 'mani:imgs/build/21-build', 'build step 21' %}
    {% imgPopUp 'mani:imgs/build/22-build', 'build step 22' %}
    {% imgPopUp 'mani:imgs/build/23-build', 'build step 23' %}
    :::
1. The AC outlet receptacles have spring-loaded covers.
    :::_ .imgs
    {% imgPopUp 'mani:imgs/build/24-build', 'build step 24' %}
    :::
1. The Anderson charging receptacles have cheaper covers and stay in whatever position you leave them.
    :::_ .imgs
    {% imgPopUp 'mani:imgs/build/25-build', 'build step 25' %}
    :::
1. To cover fans I used some magnetic vent covers. Unfortunately Aluminum (which the fan covers are made of) is not magnetic. To get around that, I attached some magnetic strips with adhesive backing above and below the fans and cut the covers to shape. You'll also see I replaced the exterior metal nuts (for the bus bars, shunt, and breaker) with black plastic acorn nuts (which are much more pleasant to accidentally bump into).
    :::_ .imgs
    {% imgPopUp 'mani:imgs/build/26-build', 'build step 26' %}
    {% imgPopUp 'mani:imgs/build/27-build', 'build step 27' %}
    {% imgPopUp 'mani:imgs/build/28-build', 'build step 28' %}
    :::
<!--{ol:.steps}-->

---

I keep everything off and only turn on what I need on a per-case basis.
- Need AC power: Open lid, turn on Inverter, close lid. Turn on Cooling switch since the Inverter can warm things up.
- Need to charge batteries but it's at or near freezing: Turn on the Heating switch and wait until the temperature gets high enough for the heater to shut off. Then plug in charger.
- Need to charge USB device(s): Turn on the 4-in-1, lift cap, plug in device.

You can use the circuit breaker as a battery shut-off switch, but the Shunt draws negligible power and so long as everything else is off I haven't seen any other power being leached.
