
/* needs the following global css definitions:
<style>
:root {
  --main-color: ...;
  --dark-color: ...;
}
</style>
*/

let ControllerSvg = {};
(function(ctx){

ctx.init = function(){

	document.getElementById("svgdefs").innerHTML += `
	<svg width=0 height=0>
		<defs>
			<radialGradient id="joygrad">
				<stop offset="5%" stop-color="black" />
				<stop offset="85%" stop-color="var(--dark-color)" />
			</radialGradient>
			<linearGradient id="levergrad">
				<stop offset="5%" stop-color="var(--dark-color)" />
				<stop offset="48%" stop-color="black" />
				<stop offset="52%" stop-color="black" />
				<stop offset="95%" stop-color="var(--dark-color)" />
			</linearGradient>
			<radialGradient id="shieldgrad">
				<stop id="shieldgrad1" offset="77%" stop-color="var(--main-color)" />
				<stop id="shieldgrad2" offset="100%" stop-color="var(--dark-color)" />
			</radialGradient>
			<radialGradient id="hullgrad" gradientUnits="userSpaceOnUse" cx=50 cy=150 r=150>
				<stop id="hullgrad1" offset="48%" stop-color="var(--main-color)" />
				<stop id="hullgrad2" offset="90%" stop-color="var(--dark-color)" />
			</radialGradient>
			<radialGradient id="triggergrad" gradientUnits="userSpaceOnUse" cx=50 cy=50 r=60>
				<stop id="triggergrad1" offset="10%" stop-color="var(--dark-color)" />
				<stop id="triggergrad2" offset="86%" stop-color="var(--main-color)" />
			</radialGradient>
			<filter height="1.3" y="-0.151" width="1.16" x="-0.0798" id="yokeblur" style="color-interpolation-filters:sRGB">
				<feGaussianBlur stdDeviation="4.16" />
			</filter>
		</defs>
	</svg>`

	document.getElementById("joystick").innerHTML += `
	<svg width=100% height=100% viewBox="0 0 100 100">
		<ellipse style="fill:var(--main-color);stroke:#ffffff;stroke-width:4"
			cx="50" cy="50" rx="47" ry="47" />
		<ellipse style="fill:var(--main-color);stroke:#ffffff;stroke-width:4"
			cx="50" cy="50" rx="32" ry="32" />
		<ellipse style="fill:var(--main-color);stroke:#ffffff;stroke-width:4"
			cx="50" cy="50" rx="17" ry="17" />
	</svg>`

	document.getElementById("joyarea").innerHTML += `
	<svg width=100% height=100% viewBox="0 0 100 100">
		<ellipse style="fill:url(#joygrad);stroke:#ffffff;stroke-width:2"
			cx="50" cy="50" rx="47" ry="47" />
		<path style="fill:var(--main-color);stroke:var(--main-color);stroke-width:2;stroke-linejoin:round"
			d="M 10,50 L 20,56 L 20,44 Z" />
		<path style="fill:var(--main-color);stroke:var(--main-color);stroke-width:2;stroke-linejoin:round"
			d="M 90,50 L 80,56 L 80,44 Z" />
		<path style="fill:var(--main-color);stroke:var(--main-color);stroke-width:2;stroke-linejoin:round"
			d="M 50,10 L 56,20 L 44,20 Z" />
		<path style="fill:var(--main-color);stroke:var(--main-color);stroke-width:2;stroke-linejoin:round"
			d="M 50,90 L 56,80 L 44,80 Z" />
	</svg>`

	document.getElementById("lever").innerHTML += `
	<svg width=100% height=100% viewBox="0 0 100 100">
		<rect style="fill:var(--main-color);stroke:#ffffff;stroke-width:4"
			x="3" y="3" width="94" height="94" rx="5" ry="40" />
		<path style="fill:var(--main-color);stroke:#ffffff;stroke-width:4"
			d="M 20,30 L 80,30" />
		<path style="fill:var(--main-color);stroke:#ffffff;stroke-width:4"
			d="M 20,50 L 80,50" />
		<path style="fill:var(--main-color);stroke:#ffffff;stroke-width:4"
			d="M 20,70 L 80,70" />
	</svg>`

	document.getElementById("leverarea").innerHTML += `
	<svg width=100% height=100% viewBox="0 0 100 100">
		<rect style="fill:url(#levergrad);stroke:#ffffff;stroke-width:2"
			x="3" y="3" width="94" height="94" rx="7" ry="7"/>
		<rect style="fill:var(--main-color)"
			x="33" y="50" width="34" height="15" rx="4" ry="4"/>
		<rect style="fill:var(--main-color)"
			x="28" y="30" width="44" height="15" rx="4" ry="4"/>
		<rect style="fill:var(--main-color)"
			x="23" y="10" width="54" height="15" rx="4" ry="4"/>
		<path style="fill:var(--main-color);stroke:var(--main-color);stroke-width:2;stroke-linejoin:round"
			d="M 10,80 L 20,86 L 20,74 Z" />
		<path style="fill:var(--main-color);stroke:var(--main-color);stroke-width:2;stroke-linejoin:round"
			d="M 90,80 L 80,86 L 80,74 Z" />
		<rect style="fill:#000000;stroke:#808080;stroke-width:2"
			x="45" y="10" width="10" height="80" rx="7" ry="7"/>
	</svg>`

	document.getElementById("status").innerHTML += `
	<svg width=100% height=100% viewBox="0 0 100 100">
		<path id="outline" d="M 37.9,16.2 C 17.5,31.6 12.3,57.3 25,75.1 C 24.7,74.5 27.5,62.6 38.8,60.3 L 36.2,70.1 C 36,71.2 36.6,71.9 37.9,71.1 L 41.3,69 C 41.9,71.4 42.6,73.9 43.3,76.3 C 45.6,77 47.9,77.3 50,77.3 C 52.1,77.3 54.4,77 56.7,76.3 C 57.4,73.9 58.1,71.4 58.7,69 L 62.1,71.1 C 63.4,71.9 64,71.2 63.8,70.1 L 61.2,60.3 C 72.5,62.6 75.3,74.5 75,75.1 C 87.7,57.3 82.5,31.6 62.1,16.2 C 69.8,35.9 77.5,53.4 58.2,46.1 C 57.1,38.2 53.8,32.7 50,32.6 C 46.2,32.7 42.9,38.2 41.8,46.1 C 22.5,53.4 30.2,35.9 37.9,16.2 Z" style="fill:#000000;stroke:#ffffff;stroke-width:3.193;stroke-linejoin:round;" />
		<g style="fill:url(#hullgrad);">
			<path id="wings" d="M 37.9,16.2 C 17.5,31.6 12.3,57.3 25,75.1 C 24.6,74.7 28.2,58.8 44.4,60 L 42.2,45.9 C 22.4,53.6 30.2,36 37.9,16.2 Z M 62.1,16.2 C 69.8,36 77.6,53.6 57.8,45.9 L 55.6,60 C 71.8,58.8 75.4,74.7 75,75.1 C 87.7,57.3 82.5,31.6 62.1,16.2 Z" style="stroke:#000000;stroke-width:1;stroke-linejoin:round;" />
			<path id="rfin" d="M 58.1,48.5 L 63.8,70.1 C 64,71.2 63.4,71.9 62.1,71.1 L 54.3,66.2 C 56.3,61.3 57.5,54 58.1,48.5 Z" style="stroke:#000000;stroke-width:1;stroke-linejoin:round;" />
			<path id="lfin" d="M 41.9,48.5 L 36.2,70.1 C 36,71.2 36.6,71.9 37.9,71.1 L 45.7,66.2 C 43.7,61.3 42.5,54 41.9,48.5 Z" style="stroke:#000000;stroke-width:1;stroke-linejoin:round;" />
			<path id="body" d="M 50,32.6 C 45.2,32.7 41.4,41.3 41.4,51.7 C 41.4,62.2 45.2,70.7 50,70.9 C 54.8,70.7 58.6,62.2 58.6,51.7 C 58.6,41.3 54.8,32.7 50,32.6 Z" style="stroke:#000000;stroke-width:1;stroke-linejoin:round;" />
			<path id="nozzle" d="M 48.7,57.8 L 45.6,57.8 L 46.3,63.3 C 44.2,63.1 42.2,62.9 40.2,62.6 C 40.7,67.3 42,71.8 43.3,76.3 C 45.6,77 47.9,77.3 50,77.3 C 52.1,77.3 54.4,77 56.7,76.3 C 58,71.8 59.3,67.3 59.8,62.6 C 57.8,62.9 55.8,63.1 53.7,63.3 L 54.4,57.8 L 51.3,57.8 L 51.8,63.4 C 51.2,63.4 50.6,63.5 50,63.5 C 49.4,63.5 48.8,63.4 48.2,63.4 Z" style="stroke:#000000;stroke-width:1;stroke-linejoin:round;" />
		</g>
		<path id="window" d="M 48,40.2 L 48.1,47.8 H 51.9 L 52,40.2 H 50 Z M 47.4,41.3 L 44.5,50.9 L 47.4,47.9 Z M 52.6,41.3 L 52.6,47.9 L 55.5,50.9 Z M 48.1,48.5 L 48.1,56.9 C 48.6,56.4 49.3,56.2 50,56.1 C 50.7,56.2 51.4,56.4 51.9,56.9 L 51.9,48.5 Z M 47.4,48.9 L 44.5,51.9 L 44.4,51.9 L 47.5,56.8 Z M 52.6,48.9 L 52.5,56.8 L 55.6,51.9 L 55.5,51.9 Z" style="fill:#ffffff;stroke-width:0.479;stroke-linejoin:round;" />
		<path id="shield" d="M 48.2,0 C 40,0.289 32.1,2.57 25,6.64 C 17.9,10.7 12,16.5 7.67,23.4 C 13.3,18.2 19.7,13.4 26.6,9.43 C 33.5,5.45 40.8,2.27 48.2,0 Z M 51.8,0 C 59.2,2.27 66.5,5.45 73.4,9.43 C 80.3,13.4 86.7,18.2 92.3,23.4 C 88,16.5 82.1,10.7 75,6.64 C 67.9,2.57 60,0.289 51.8,0 Z M 48.3,4.31 C 40.9,4.57 33.6,6.66 27.2,10.4 C 20.7,14.1 15.3,19.4 11.3,25.7 C 16.5,20.9 22.3,16.6 28.6,12.9 C 34.9,9.29 41.6,6.38 48.3,4.31 Z M 51.7,4.31 C 58.4,6.38 65.1,9.29 71.4,12.9 C 77.7,16.6 83.5,20.9 88.7,25.7 C 84.7,19.4 79.3,14.1 72.8,10.4 C 66.4,6.66 59.1,4.57 51.7,4.31 Z M 48.5,8.41 C 41.7,8.65 35.1,10.6 29.2,13.9 C 23.3,17.3 18.4,22.1 14.8,27.9 C 19.5,23.5 24.8,19.6 30.5,16.3 C 36.3,13 42.4,10.3 48.5,8.41 Z M 51.5,8.41 C 57.6,10.3 63.7,13 69.5,16.3 C 75.2,19.6 80.5,23.5 85.2,27.9 C 81.6,22.1 76.7,17.3 70.8,13.9 C 64.9,10.6 58.3,8.65 51.5,8.41 Z M 5.84,26.6 C 2.01,33.8 0,41.8 0,50 C 0.012,58.2 2.02,66.2 5.84,73.4 C 4.12,65.9 3.23,58 3.21,50 C 3.22,42 4.11,34.1 5.84,26.6 Z M 94.2,26.6 C 95.9,34.1 96.8,42 96.8,50 C 96.8,58 95.9,65.9 94.2,73.4 C 98,66.2 100,58.2 100,50 C 100,41.8 98,33.8 94.2,26.6 Z M 9.64,28.6 C 6.15,35.2 4.32,42.5 4.31,50 C 4.32,57.5 6.15,64.8 9.64,71.4 C 8.07,64.5 7.26,57.3 7.24,50 C 7.26,42.7 8.07,35.5 9.64,28.6 Z M 90.4,28.6 C 91.9,35.5 92.7,42.7 92.8,50 C 92.7,57.3 91.9,64.5 90.4,71.4 C 93.9,64.8 95.7,57.5 95.7,50 C 95.7,42.5 93.8,35.2 90.4,28.6 Z M 13.3,30.5 C 10.1,36.5 8.42,43.2 8.41,50 C 8.42,56.8 10.1,63.5 13.3,69.5 C 11.8,63.2 11.1,56.6 11.1,50 C 11.1,43.4 11.8,36.8 13.3,30.5 Z M 86.7,30.5 C 88.2,36.8 88.9,43.4 88.9,50 C 88.9,56.6 88.2,63.2 86.7,69.5 C 89.9,63.5 91.6,56.8 91.6,50 C 91.6,43.2 89.9,36.5 86.7,30.5 Z M 14.8,72.1 C 18.4,77.9 23.3,82.7 29.2,86.1 C 35.1,89.4 41.7,91.3 48.5,91.6 C 42.4,89.7 36.3,87 30.5,83.7 C 24.8,80.4 19.5,76.5 14.8,72.1 Z M 85.2,72.1 C 80.5,76.5 75.2,80.4 69.5,83.7 C 63.7,87 57.6,89.7 51.5,91.6 C 58.3,91.3 64.9,89.4 70.8,86.1 C 76.7,82.7 81.6,77.9 85.2,72.1 Z M 11.3,74.3 C 15.3,80.6 20.7,85.9 27.2,89.6 C 33.6,93.3 40.9,95.4 48.3,95.7 C 41.6,93.6 34.9,90.7 28.6,87.1 C 22.3,83.4 16.5,79.1 11.3,74.3 Z M 88.7,74.3 C 83.5,79.1 77.7,83.4 71.4,87.1 C 65.1,90.7 58.4,93.6 51.7,95.7 C 59.1,95.4 66.4,93.3 72.8,89.6 C 79.3,85.9 84.7,80.6 88.7,74.3 Z M 7.67,76.6 C 12,83.5 17.9,89.3 25,93.4 C 32.1,97.4 40,99.7 48.2,100 C 40.8,97.7 33.5,94.5 26.6,90.6 C 19.7,86.6 13.3,81.8 7.67,76.6 Z M 92.3,76.6 C 86.7,81.8 80.3,86.6 73.4,90.6 C 66.5,94.5 59.2,97.7 51.8,100 C 60,99.7 67.9,97.4 75,93.4 C 82.1,89.3 88,83.5 92.3,76.6 Z" style="fill:url(#shieldgrad);stroke-width:4.106;stroke-linecap:square;stroke-linejoin:round;" />
	</svg>`

	document.getElementById("yoketriggerarea").innerHTML += `
	<svg width=100% height=100% viewBox="0 0 160 90" preserveAspectRatio="none">
		<path id="rect1234" d="M 136,27.5 C 135,27.4 133,28.2 132,28.8 C 122,34 109,36.1 115,44.5 C 122,52.6 123,59.6 124,70.1 C 125,79.4 103,88.7 98.6,79.4 C 96.5,70.1 85.4,71.2 85.4,71.2 H 75 C 75,71.2 64,70.1 61.4,79.4 C 57.8,88.7 35.6,79.4 36.5,70.1 C 37.3,59.6 39.1,52.6 45.8,44.5 C 52.1,36.1 38.3,33.8 29.7,28.8 C 27.9,27.8 26.2,27.5 24.4,27.5 C 19.5,27.6 16.9,35.5 13.2,43.7 C 10.1,53.8 9.14,72.4 10.7,85.2 C 10.7,87.5 11.7,89.9 12.7,91 H 148 C 148,89.9 150,87.5 150,85.2 C 151,72.4 150,53.8 147,43.7 C 143,35.4 141,27.4 136,27.5 Z" style="opacity:1;fill:#4d4d4d;fill-opacity:1;stroke:#999999;stroke-width:0.685;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
		<path id="path1343" d="M 24.3 35.6 L 24.9 35.6 C 25.2 35.6 24.3 35.6 24.3 35.6 z M 24.3 35.6 L 24.3 36.4 C 22.6 38.5 21.8 42.3 20 46.4 C 17.5 54.1 15.7 74 17.5 84.8 A 7.85 7.85 0 0 1 17.5 85.7 L 17.5 86.6 C 57 107 96.6 107 141 85.7 A 7.85 7.85 0 0 1 141 84.8 C 143 74 141 54.1 139 46.4 C 137 42.3 136 38.4 134 36.3 L 134 35.8 C 129 38.5 124 40.3 122 41.7 C 128 50.7 130 59.6 131 69.2 C 132 74.7 128 79.2 126 82.2 C 122 85.7 119 87.4 116 89.1 C 111 90 107 90.8 103 90.8 C 98.3 90 93.1 87.4 90.6 81.7 A 7.85 7.85 0 0 1 90.6 81.2 C 90.6 79.8 89.7 79.8 88.8 79.5 C 87.1 79.1 85.4 79.2 85.4 79.2 A 7.85 7.85 0 0 1 84.5 79.2 L 74.2 79.2 A 7.85 7.85 0 0 1 73.4 79.2 C 73.4 79.2 71.6 79.1 69.9 79.5 C 69.1 79.8 68.2 79.8 68.2 81.2 A 7.85 7.85 0 0 1 68.2 81.7 C 65.6 87.4 60.5 90 56.2 90.8 C 51.9 90.8 47.6 90 43.3 89.1 C 39.8 87.4 36.4 85.7 32.9 82.2 C 30.4 79.2 26.9 74.7 27.8 69.2 C 28.6 59.6 30.4 50.6 37.2 41.7 C 34.7 40.2 29.5 38.4 24.3 35.6 z " style="opacity:1;fill:#9e9e9e;fill-opacity:1;stroke:none;stroke-width:0.688;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;filter:url(#yokeblur)" />
	</svg>`

	document.getElementById("joytrigger").innerHTML =
	document.getElementById("levertrigger").innerHTML =
	document.getElementById("yoketriggericon1").innerHTML =
	document.getElementById("yoketriggericon2").innerHTML =`
	<svg width=100% height=100% viewBox="0 0 100 100">
		<path style="fill:url(#triggergrad);stroke:url(#triggergrad);stroke-width:3;stroke-linejoin:round"
			d="M 56.9,2 L 49.9,41.4 L 42.9,2 Z M 98,43.2 V 57.1 L 58.6,50.1 Z M 2,43.2 L 41.2,50.1 L 2,57.1 Z M 49.9,58.8 L 56.9,98 H 42.9 Z" />
		<path style="fill:#ffffff;stroke:#ffffff;stroke-width:4;stroke-linejoin:square"
			d="M 61.1,13.9 A 37.9,37.9 0 0 1 76.8,23.2 A 37.9,37.9 0 0 1 86.1,39 A 54.2,35.5 45 0 0 75.1,25 A 54.2,35.5 45 0 0 61.1,13.9 Z M 38.8,13.9 A 35.5,54.2 45 0 0 24.8,25 A 35.5,54.2 45 0 0 13.7,39 A 37.9,37.9 0 0 1 23,23.2 A 37.9,37.9 0 0 1 38.8,13.9 Z M 86.1,61.2 A 37.9,37.9 0 0 1 76.8,77 A 37.9,37.9 0 0 1 61.1,86.3 A 35.5,54.2 45 0 0 75.1,75.2 A 35.5,54.2 45 0 0 86.1,61.2 Z M 13.7,61.2 A 54.2,35.5 45 0 0 24.8,75.2 A 54.2,35.5 45 0 0 38.8,86.3 A 37.9,37.9 0 0 1 23,77 A 37.9,37.9 0 0 1 13.7,61.2 Z" />
	</svg>`

	document.getElementById("pause").innerHTML =`
	<svg width=100% height=100% viewBox="0 0 100 32" preserveAspectRatio="none">
		<path style="opacity:1;vector-effect:none;fill:var(--main-color);fill-opacity:1;fill-rule:evenodd;stroke:#e6e6e6;stroke-width:0.278;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" d="M 20.2,1.02 L 1.75,33.2 H 98.2 L 79.8,1.02 Z" id="path1817" />
		<path style="font-style:italic;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:14.11111069px;font-family:Ethnocentric;-inkscape-font-specification:'Ethnocentric Italic';fill:#ffffff;stroke-width:0.99999994" d="M 139.53516 54.029297 C 137.79294 54.029297 136.28195 54.438083 135.00195 55.255859 C 133.72195 56.073638 132.61976 56.998186 131.69531 58.029297 L 103.10938 90.294922 L 116.17578 90.294922 L 137.08203 66.615234 L 141.83008 76.056641 C 142.25675 76.909975 142.71902 77.834523 143.2168 78.830078 C 143.71458 79.790078 144.15772 80.588516 144.54883 81.228516 C 143.69549 81.15741 142.70028 81.123047 141.5625 81.123047 L 138.20312 81.123047 L 129.29688 81.123047 L 120.97656 90.294922 L 162.46875 90.294922 L 145.88281 58.029297 C 145.27837 56.89152 144.47798 55.949793 143.48242 55.203125 C 142.52242 54.420904 141.20627 54.029297 139.53516 54.029297 z M 75.105469 54.615234 L 66.144531 63.896484 L 96.865234 63.896484 C 98.429679 63.896484 99.602542 64.215469 100.38477 64.855469 C 101.20254 65.459913 101.61133 66.277483 101.61133 67.308594 C 101.61133 68.695262 101.06121 69.833769 99.958984 70.722656 C 98.856761 71.611546 97.345781 72.056641 95.425781 72.056641 L 64.705078 72.056641 L 61.505859 90.294922 L 72.492188 90.294922 L 74.091797 81.175781 L 92.757812 81.175781 C 95.851144 81.175781 98.643923 80.803306 101.13281 80.056641 C 103.6217 79.309972 105.71912 78.278446 107.42578 76.962891 C 109.168 75.61178 110.50134 74.010999 111.42578 72.162109 C 112.38578 70.313222 112.86523 68.286476 112.86523 66.082031 C 112.86523 64.375363 112.52712 62.830025 111.85156 61.443359 C 111.17601 60.021138 110.18079 58.811962 108.86523 57.816406 C 107.58523 56.785293 105.98445 56.002082 104.06445 55.46875 C 102.18001 54.899861 99.994746 54.615234 97.505859 54.615234 L 75.105469 54.615234 z M 168.05078 54.615234 L 164.47656 74.722656 C 164.26322 75.895988 164.15625 77.015363 164.15625 78.082031 C 164.15625 82.348697 165.9175 85.548306 169.4375 87.681641 C 172.99306 89.814972 178.59188 90.882812 186.23633 90.882812 C 201.02744 90.882812 209.38273 85.495988 211.30273 74.722656 L 214.87695 54.615234 L 203.7832 54.615234 L 200.21094 74.722656 C 199.99761 75.967101 199.62318 77.032988 199.08984 77.921875 C 198.59206 78.810764 197.8643 79.540486 196.9043 80.109375 C 195.9443 80.678257 194.71599 81.087043 193.22266 81.335938 C 191.76488 81.584832 189.97122 81.708984 187.83789 81.708984 C 185.38456 81.708984 183.35781 81.621123 181.75781 81.443359 C 180.15781 81.26558 178.87602 80.980954 177.91602 80.589844 C 176.95602 80.198733 176.28174 79.682969 175.89062 79.042969 C 175.49951 78.402969 175.30273 77.619757 175.30273 76.695312 C 175.30273 76.126423 175.35623 75.469322 175.46289 74.722656 L 179.08984 54.615234 L 168.05078 54.615234 z M 235.64062 54.615234 C 232.51174 54.615234 229.84507 54.936172 227.64062 55.576172 C 225.43618 56.216172 223.62339 57.121588 222.20117 58.294922 C 220.81451 59.432698 219.80016 60.785165 219.16016 62.349609 C 218.52016 63.878499 218.20117 65.54995 218.20117 67.363281 C 218.20117 69.958839 219.1429 72.03712 221.02734 73.601562 C 222.91179 75.166007 225.88026 75.949219 229.93359 75.949219 L 249.40039 75.949219 C 251.64039 75.949219 252.76172 76.659808 252.76172 78.082031 C 252.76172 79.113142 252.4236 79.877224 251.74805 80.375 C 251.07249 80.872779 249.98747 81.123047 248.49414 81.123047 L 221.45508 81.123047 L 212.76172 90.294922 L 245.98828 90.294922 C 249.15273 90.294922 251.83657 89.975938 254.04102 89.335938 C 256.28102 88.660382 258.0938 87.735834 259.48047 86.5625 C 260.90269 85.353613 261.93422 83.93048 262.57422 82.294922 C 263.21422 80.659367 263.53516 78.882891 263.53516 76.962891 C 263.53516 74.296225 262.52081 72.286657 260.49414 70.935547 C 258.50303 69.548881 255.57087 68.855469 251.69531 68.855469 L 232.28125 68.855469 C 230.00569 68.855469 228.86719 68.181191 228.86719 66.830078 C 228.86719 65.763412 229.2053 65.01651 229.88086 64.589844 C 230.55641 64.12762 231.64143 63.896484 233.13477 63.896484 L 257.88086 63.896484 L 266.62695 54.615234 L 235.64062 54.615234 z M 272.54102 54.615234 L 266.19531 90.294922 L 300.54102 90.294922 L 309.28906 81.123047 L 278.88867 81.123047 L 279.74219 76.269531 L 301.71484 76.269531 L 309.39453 68.162109 L 281.18164 68.162109 L 281.92773 63.896484 L 305.02148 63.896484 L 313.82227 54.615234 L 272.54102 54.615234 z " transform="scale(0.26458333)" id="path43" />
	</svg>`

	document.getElementById("left").innerHTML =`
	<svg width=100% height=100% viewBox="-50 -50 200 200">
		<path d="M 0,50 L 100,100 L 100,0 Z" style="fill:var(--main-color);stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;" />
	</svg>`

	document.getElementById("right").innerHTML =`
	<svg width=100% height=100% viewBox="-50 -50 200 200">
		<path d="M 100,50 L 0,100 L 0,0 Z" style="fill:var(--main-color);stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;" />
	</svg>`

	document.getElementById("go").innerHTML =`
	<svg width=100% height=100% viewBox="-20 -20 140 60">
		<path d="M 39.21,1.681 C 35.2,1.681 32.04,2.381 29.7,3.781 C 27.36,5.081 25.81,7.281 25.06,10.18 C 24.29,13.08 24.72,15.28 26.35,16.58 C 27.99,17.98 30.82,18.58 34.84,18.58 C 38.83,18.58 42,17.98 44.32,16.58 C 46.66,15.28 48.21,13.08 48.97,10.18 C 49.72,7.281 49.27,5.081 47.62,3.781 C 45.98,2.381 43.17,1.681 39.21,1.681 Z M 88.71,1.681 C 84.71,1.681 81.55,2.381 79.21,3.781 C 76.87,5.081 75.31,7.281 74.56,10.18 C 73.8,13.08 74.23,15.28 75.87,16.58 C 77.51,17.98 80.33,18.58 84.34,18.58 C 88.34,18.58 91.52,17.98 93.81,16.58 C 96.2,15.28 97.76,13.08 98.49,10.18 C 99.21,7.281 98.81,5.081 97.12,3.781 C 95.47,2.381 92.62,1.681 88.71,1.681 Z M 13.49,1.981 C 12.09,1.981 10.72,2.181 9.411,2.581 C 8.118,2.881 6.932,3.481 5.857,4.181 C 4.75,4.881 3.826,5.781 3.084,6.781 C 2.344,7.781 1.822,8.781 1.516,9.985 C 1.206,11.18 1.163,12.28 1.386,13.28 C 1.608,14.28 2.082,15.18 2.813,15.98 C 3.515,16.68 4.408,17.28 5.493,17.68 C 6.599,18.08 7.851,18.38 9.261,18.38 H 20.5 L 23.15,8.181 H 12.69 L 8.701,11.78 H 17.15 L 16.54,14.08 H 10.35 C 9.651,14.08 9.031,13.98 8.503,13.88 C 7.971,13.68 7.524,13.38 7.16,12.98 C 6.827,12.68 6.599,12.28 6.478,11.78 C 6.377,11.38 6.403,10.78 6.558,10.18 C 6.709,9.585 6.966,9.081 7.33,8.581 C 7.695,8.081 8.136,7.681 8.661,7.281 C 9.201,6.981 9.801,6.681 10.43,6.481 C 11.06,6.281 11.71,6.181 12.39,6.181 H 20.84 L 25.22,1.981 Z M 63.03,1.981 C 61.61,1.981 60.23,2.181 58.92,2.581 C 57.62,2.881 56.44,3.481 55.37,4.181 C 54.33,4.881 53.43,5.781 52.67,6.781 C 51.92,7.781 51.4,8.781 51.1,9.985 C 50.79,11.18 50.74,12.28 50.96,13.28 C 51.2,14.28 51.65,15.18 52.32,15.98 C 53.03,16.68 53.92,17.28 55,17.68 C 56.11,18.08 57.37,18.38 58.8,18.38 H 70.01 L 72.65,8.181 H 62.19 L 58.21,11.78 H 66.69 L 66.07,14.08 H 59.88 C 59.17,14.08 58.55,13.98 58.02,13.88 C 57.48,13.68 57.04,13.38 56.69,12.98 C 56.34,12.68 56.11,12.28 55.99,11.78 C 55.89,11.38 55.91,10.78 56.06,10.18 C 56.22,9.585 56.48,9.081 56.83,8.581 C 57.21,8.081 57.66,7.681 58.19,7.281 C 58.71,6.981 59.3,6.681 59.94,6.481 C 60.57,6.281 61.23,6.181 61.93,6.181 H 70.35 L 74.73,1.981 Z M 38.1,5.981 C 39.36,5.981 40.43,5.981 41.29,6.181 C 42.14,6.181 42.79,6.381 43.24,6.781 C 43.73,6.981 44.02,7.481 44.12,8.081 C 44.22,8.581 44.17,9.281 43.94,10.18 C 43.71,10.98 43.41,11.78 43.02,12.28 C 42.65,12.78 42.13,13.28 41.48,13.58 C 40.87,13.88 40.1,14.08 39.2,14.18 C 38.29,14.28 37.2,14.38 35.93,14.38 C 34.65,14.38 33.59,14.28 32.74,14.18 C 31.88,14.08 31.21,13.88 30.74,13.58 C 30.3,13.28 30,12.78 29.88,12.28 C 29.78,11.78 29.85,10.98 30.07,10.18 C 30.3,9.281 30.61,8.581 30.99,8.081 C 31.4,7.481 31.9,6.981 32.52,6.781 C 33.15,6.381 33.92,6.181 34.83,6.181 C 35.74,5.981 36.83,5.981 38.1,5.981 Z M 87.61,5.981 C 88.87,5.981 89.93,5.981 90.79,6.181 C 91.61,6.181 92.35,6.381 92.81,6.781 C 93.26,6.981 93.54,7.481 93.63,8.081 C 93.72,8.581 93.72,9.281 93.45,10.18 C 93.17,10.98 92.9,11.78 92.53,12.28 C 92.16,12.78 91.61,13.28 90.97,13.58 C 90.33,13.88 89.61,14.08 88.7,14.18 C 87.79,14.28 86.7,14.38 85.44,14.38 C 84.16,14.38 83.1,14.28 82.25,14.18 C 81.39,14.08 80.73,13.88 80.26,13.58 C 79.8,13.28 79.52,12.78 79.42,12.28 C 79.32,11.78 79.38,10.98 79.61,10.18 C 79.84,9.281 80.14,8.581 80.53,8.081 C 80.91,7.481 81.41,6.981 82.02,6.781 C 82.66,6.381 83.43,6.181 84.34,6.181 C 85.24,5.981 86.34,5.981 87.61,5.981 Z" style="fill:#ffffff;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;" />
	</svg>`
}

ctx.setHull = function(value){
	document.getElementById("hullgrad1").offset.baseVal = 0.48+value*0.4
	document.getElementById("hullgrad2").offset.baseVal = 0.48+value*0.4+0.015
}

ctx.setShield = function(value){
	document.getElementById("shieldgrad1").offset.baseVal = 0.77+value*0.23
	document.getElementById("shieldgrad2").offset.baseVal = 0.77+value*0.23+0.02
}

ctx.setAmmo = function(value){
	document.getElementById("triggergrad1").offset.baseVal = 0.83-value*0.73
	document.getElementById("triggergrad2").offset.baseVal = 0.83-value*0.73+0.03
}

})(ControllerSvg);
export{ControllerSvg as default}