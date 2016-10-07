/*
 * drew's script
 */ 


window.onload = function() {
	var height = window.innerHeight;
	var width = window.innerWidth;

	var root = d3.select("#root");	
	root.style("height", height + "px")
	root.style("width", width + "px");
	
	
	// D3 code
		
	// http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png
	//
	var mapboxTiles = L.tileLayer('https://api.mapbox.com/v4/mapbox.run-bike-hike/{z}/{x}/{y}.png?access_token={token}', {
       			attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>',
       			token: 'pk.eyJ1IjoiZHJld3N0aWxlcyIsImEiOiJjaWw2YXR4eXgwMWl6dWhsdjhrZGxuMXBqIn0.4rYaU8tPJ9Mw2bniPfAKdQ'
	});
	var map = L.map('map', {zoomControl:false})
		.addLayer(mapboxTiles)
		.setView([33.91439678750913, -118.245], 11);
		
	map.touchZoom.disable();
	map.doubleClickZoom.disable();
	map.scrollWheelZoom.disable();		
	
	var svg = d3.select(map.getPanes().overlayPane).append("svg");
	var g = svg.append("g").attr("class", "leaflet-zoom-hide");
	
	var ratios = [
		[0.40,0.35,0.30,0.25,0.15,0.20,0.30,0.43,0.69,0.53,0.50,0.33,0.33,0.40,0.55,0.60,0.70,0.75,0.50,0.40,0.20,0.33,0.50,0.55],
		[0.04,0.03,0.03,0.02,0.01,0.02,0.03,0.04,0.07,0.05,0.04,0.03,0.03,0.04,0.05,0.07,0.07,0.08,0.06,0.04,0.02,0.03,0.05,0.05]
	];
	console.log(ratios);
		
	console.log(ratios[0].length);	
	console.log(ratios[1].length);
	var maxTime = 23;
	var minTime = 0;
	var currentTime = minTime;
	var numAuto = 0;
	var numAcc = 0;
	var autoIdx = 0;
	var accIdx = 1;
	var accidentResizeAnimationLength = 500;
	var numberOfAutonomousMarkers = 400;
	var points = d3.selectAll(".point")[0];
	d3.json("roads.json", function(data) {
		var features = data.features;
		mapCoordinatesToView(features);
		
		var transform = d3.geo.transform({ point: projectPoint });
		var d3path = d3.geo.path().projection(transform);
			
		var toLine = d3.svg.line()
			.interpolate("linear")
			.x(function(d) {
				return applyLatLngToLayer(d).x
			})
			.y(function(d) {
				return applyLatLngToLayer(d).y
			});
		
			
		var linePath = g.selectAll(".lineConnect")
				.data([features])
				.enter()
				.append("path")
				.attr("class", "lineConnect");
				
				
		function reset() {
				var bounds = d3path.bounds(data),
					topLeft = bounds[0],
					bottomRight = bounds[1];
				
			linePath.attr("d", toLine);
			for (var index = 0; index < numberOfAutonomousMarkers; index++) {
		
				var l = linePath.node().getTotalLength();
				var t = index / numberOfAutonomousMarkers;
				var p = linePath.node().getPointAtLength(t * l);
				
				
				g.append("circle")
							.attr("r", 0)
							.attr("fill", "red")
							.attr("class", "point")
							.style("opacity", "0.8")
							.attr("transform", "translate(" + p.x + "," + p.y + ")")
							.transition()
							.duration(accidentResizeAnimationLength)
							.attr("r", 4);	
			}	
			
			points = d3.selectAll(".point")[0];
			for (var i = 0; i < points.length; i++) {
				points[i].state = 0;
			}
					
				svg.attr("width", bottomRight[0] - topLeft[0] + 120)
					.attr("height", bottomRight[1] - topLeft[1] + 120)
					.style("left", topLeft[0] - 50 + "px")
					.style("top", topLeft[1] - 50 + "px");
			
				g.attr("transform", "translate(" + (-topLeft[0] + 50) + ","
					+ (-topLeft[1] + 50) + ")");
		} // end reset function
								
		function applyLatLngToLayer(d) {
			var y = d.geometry.coordinates[1]
			var x = d.geometry.coordinates[0];
			return map.latLngToLayerPoint(new L.LatLng(y, x))
		}
	
		function mapCoordinatesToView(data) {
			for (var i = 0; i < data.length; i++) {
				var coordinates = applyLatLngToLayer(data[i]);
			
				data[i].properties.x = coordinates.x;
				data[i].properties.y = coordinates.y;
			}
		}
		
		function projectPoint(x, y)	{
			var point = map.latLngToLayerPoint(new L.LatLng(y, x));
			this.stream.point(point.x, point.y);
		}

		
		function drawTime(t) {
			// check min bound
			if (t == minTime) {
				document.getElementById("prevTime").disabled = true;
			}
			else {
				document.getElementById("prevTime").disabled = false;
			}
			
			// check max bound
			if (t == maxTime) {
				document.getElementById("nextTime").disabled = true;
			}
			else {
				document.getElementById("nextTime").disabled = false;
			}

			drawAcc();
			
			setTimeout(function() {
				drawAuto();
			}, accidentResizeAnimationLength);
				
			// update legend	
			document.getElementById("percentAcc").innerHTML = getRatio("acc").split("\.")[0];
			document.getElementById("time").innerHTML = (currentTime); 
		} // end drawYear function
		
		function getRatio(about) {
			if (about == "auto") {
				return (parseFloat(numAuto) / points.length).toFixed(2);
			}
			else if (about == "acc") {
				return (parseFloat(numAcc)).toFixed(2)
			}
			else {
				console.error("about = " + about);
			}
		};
		
		function setAuto() {
			for (var i = 0; i < points.length; i++) {
				var p = points[i];
				if (p.autonomous) {
					p.style.fill = "yellow";
				}
				else {
					p.style.fill = "blue";						
				}
			}
		}
		
		function drawAuto() {
		
				var protect = 0;
				while (true) {
					if (protect++ > 1000) break;
					var i = Math.floor(Math.random() * points.length);
					var p = points[i];
					if (getRatio("auto") < ratios[autoIdx][currentTime - minTime]) {
						// increase from current state
						if (!p.autonomous) {
							p.autonomous = true;
							numAuto++;
						}
						else {
							continue;
						}
					}
					else if (getRatio("auto") > ratios[autoIdx][currentTime - minTime]) {
						// decrease from current state
						if (p.autonomous) {
							p.autonomous = false;
							numAuto--;
						}
						else {
							continue;
						}
					}
					else {
						break;
					}
				}
			
			setAuto();
		}
	
		function drawAcc() {
			d3.selectAll(".accident").transition().duration(accidentResizeAnimationLength).attr("r", 0);
			numAcc = parseFloat(ratios[accIdx][currentTime - minTime]) * 100;
			g.selectAll(".probability").remove();
			setTimeout(function() {
				var l = linePath.node().getTotalLength();
				g.selectAll(".accident").remove();
				for (var i = 1; i <= numAcc; i++) {
					var t = 0;
					if (i == numAcc) {
						t = Math.random();
					}
					else {
						t = i / numAcc;
					}
					var p = linePath.node().getPointAtLength(t * l);
				
					g.append("circle")
						.attr("r", 0)
						.attr("class", "accident")
						.style("opacity", "0.8")
						.attr("transform", "translate(" + p.x + "," + p.y + ")")
						.transition()
						.duration(accidentResizeAnimationLength)
						.attr("r", 30);
						
					g.append("text")
						.attr("class", "probability")
						.attr("transform", "translate(" + p.x + "," + p.y + ")")
						 .attr("dx", -18)
						.attr("dy", 5)
						.style("fill", "white")
						.text(d3.format(".1f")(Math.random() * 10 + 90) + "%");
				}
			}, accidentResizeAnimationLength*2); // allow 2 prior animation frames
		}

		
		document.getElementById("nextTime").addEventListener("click", function() {
			drawTime(++currentTime);
		});
		
		document.getElementById("prevTime").addEventListener("click", function() {
			drawTime(--currentTime);
		});
		
		reset();
		drawTime(currentTime);
		
	}); // end d3.json function
	
	
	d3.csv("lb.csv", function(data) {
		console.log(data);
	});	
};
