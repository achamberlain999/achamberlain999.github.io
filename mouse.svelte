# Note this is just the svelte code copied from another repo. There'll be some steps needed to compile this to the bundle.

<script>
	const M = 4000;
	const M_alpha = 80

	let x = 1000;
	let y = 1000;

	$: x_svg = x / 100;
	$: y_svg = y / 100;

	let key;
	let flipped = false;
	
	$: multiplier = flipped ? -1 : 1;
	
	let dragging = false;
	let draggingProbe = false;
	
	export let alpha = 0;
	$: alpha_rad = alpha * Math.PI / 180

	$: new_x_svg = y_svg * Math.sin(alpha_rad) + x_svg * Math.cos(alpha_rad)
	$: new_y_svg = y_svg * Math.cos(alpha_rad) - x_svg * Math.sin(alpha_rad)

	$: new_x = new_x_svg * 100
	$: new_y = new_y_svg * 100
	
	function round(number) {
		return Math.round(number * 100) / 100
	}

	function handleKeydown(event) {
		key = event.key;
		if (key === 'd') {
			dragging = !dragging
		}
		if (key === 'f') {
			flipped = !flipped
		}
	}
	
	function onProbeMouseDown() {
		draggingProbe = true
	}
	
	let svgBox;
	$: rect = svgBox?.getBoundingClientRect()
	$: left = rect?.left
	$: right = rect?.right
	$: top = rect?.top
	$: bottom = rect?.bottom
	
	function windowToSvgCoord(x, y) {
		let xd = ((x - left) / (right - left)) * 100 - 50
		let yd = - (((y - top) / (bottom - top)) * 100 - 50)
		return [xd, yd]
	}
	
	let m = { x: 0, y: 0 };

	function handleMousemove(event) {
		m.x = event.clientX;
		m.y = event.clientY;
		let result = windowToSvgCoord(m.x, m.y)
		let potential_x_svg = result[0]
		let potential_y_svg = result[1]
		if (draggingProbe) {
			let potential_alpha = 180 * Math.atan(potential_y_svg / potential_x_svg) / Math.PI
			if (Math.abs(potential_alpha) > M_alpha) return
			if (potential_x_svg * potential_x_svg + potential_y_svg * potential_y_svg < 10*10) return
			if (potential_x_svg < 0) {
				flipped = true
				alpha = potential_alpha
			} else {
				alpha = potential_alpha
				flipped = false
			}
		}
		if (!dragging) return
		if (potential_x_svg * potential_x_svg + potential_y_svg * potential_y_svg > 42*42) {
			dragging = false
			return
		}
		x = round(potential_x_svg * 100)
		y = round(potential_y_svg * 100)
	}
	
	function handleMouseUp() {
		draggingProbe = false
	}
	
</script>
<svelte:window on:keydown={handleKeydown}/>

<div on:mousemove={handleMousemove} on:mouseup={handleMouseUp}>



<div style="display: flex;flex-direction:column;align-items:center;width:100%;justify-content:space-around;">

	<h1>Mice</h1>

	<label style="display:flex;width:300px;justify-content:space-between;align-items:center">
		<span>x</span>
		<input type=number inputmode='numeric' bind:value={x} min={-M} max={M} style="width:100px;">
		<input type=range bind:value={x} min={-M} max={M}>
	</label>

	<label style="display:flex;width:300px;justify-content:space-between;align-items:center">
		<span>y</span>
		<input type=number inputmode='numeric' bind:value={y} min={-M} max={M} style="width:100px;">
		<input type=range bind:value={y} min={-M} max={M}>
	</label>

	<label style="display:flex;width:300px;justify-content:space-between;align-items:center">
		<span>a</span>
		<input type=number bind:value={alpha} min={-M_alpha} max={M_alpha} style="width:100px;">
		<input type=range bind:value={alpha} min={-M_alpha} max={M_alpha}>
	</label>

	<label style="display:flex;width:300px;justify-content:center;align-items:center">
		<input type=checkbox bind:checked={flipped}>
		<span style="margin-bottom:10px;padding-left:6px;">flip</span>
	</label>

	<div style="padding-bottom: 10px;">
		<b>{new_x * multiplier > 0 ? "Pull back" : "Insert"}</b> by: <span style="font-size:20px">{round(Math.abs(new_x))} μm</span>
	</div>
	<div style="padding-bottom: 10px;">
		Move towards the <b>{new_y > 0 ? "head" : "tail"}</b> by: <span style="font-size:20px">{round(Math.abs(new_y))} μm</span>
	</div>
</div>




<div style="display: flex; justify-content: center; padding-top: 60px">

<svg bind:this={svgBox} id="svg" viewBox='-50 -50 100 100' width='50px'>
	
	<circle class='clock-face' r='42'/>
	
	<text class='noselect' font-size='3' x=-3.5 y=-48>head</text>
	<line
				class='old-axis'
				x1='0'
				x2='42'
				/>
	
	<line
				class='old-axis'
				y1='0'
				y2='-42'
				/>

	 <circle class='dot' cx={x_svg} cy={-y_svg} r="1" on:mousedown={() => {dragging = true}} on:mouseup={() => {dragging = false}} />
	
	
		<line
				class='new-axis'
				x1='0'
				x2='{flipped?-42:42}'
				transform='rotate({-alpha})'
				/>
	
			<line
				class='probe'
				x1='{flipped?-42:42}'
				x2='{flipped?-50:50}'
				transform='rotate({-alpha})'
				on:mousedown='{onProbeMouseDown}'
				/>
	
	<text class='noselect' font-size='3' y=-44 transform='rotate({-alpha})'>y'</text>
	
	<line
				class='new-axis'
				y1='0'
				y2='-42'
				transform='rotate({-alpha})'
				/>
	
	<text class='noselect' font-size='2' x={flipped?-40:30} transform='rotate({-alpha})'>x' (probe)</text>
	
<!-- x axis	 -->
	<line
				class='{new_x * multiplier > 0 ? "new-path-red" : "new-path-green"}'
				y1='0'
				y2='{new_x_svg}'
				transform='rotate({-90-alpha})'
				/>
	
	<text
				class='noselect'
				font-size=2 
				y={-new_y_svg} 
				transform='rotate({-alpha})' 
				x=1>
		{round(Math.abs(new_y))}
	</text>
	
	<!-- y axis	 -->
	<line
				class='{new_y_svg > 0 ? "new-path-green" : "new-path-red"}'
				y1='0'
				y2='{new_y_svg}'
				transform='rotate({180-alpha})'
				/>
	
	<text
				class='noselect'
				font-size=2
				y={-new_x_svg}
				transform='rotate({90-alpha})'
				x=1>
		{round(Math.abs(new_x))}
	</text>

</svg>
</div>
</div>

<style>
	svg {
		width: 80%;
		max-width: 600px;
		position: center;
	}

	.clock-face {
		stroke: #333;
		fill: white;
	}

	
	.dot {
		fill: rgb(180,0,180);
		stroke-width: 3px;
	}

	.old-axis {
		stroke: rgb(230,230,230);
	}
	
	.new-axis {
		stroke: rgb(220,220,255);
	}
	
	.new-path-red {
		stroke: rgb(180,0,0);
	}
	
	.new-path-green {
		stroke: rgb(0,180,0);
	}
	
	
	.probe {
		stroke: rgb(30,30,30);
		stroke-width: 5px;
	}
	
	.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
	}
	
</style>
