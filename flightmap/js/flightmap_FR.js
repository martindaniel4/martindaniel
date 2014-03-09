// Copyright Martin DANIEL - Oct. 2011

var datae = [];
var data2 = [];
var sessioncountmin = 0;
var sessioncountmax = 50;
var flights = {};
var connections = [];
var connections2 =[];
var flights2 = [];
var height = window.innerHeight*0.98,
	width = window.innerWidth*0.98;

var format = d3.format("1f"),
			mille = d3.format(",");
			
var quart1 = 4.0,
	quart2 = 4.5,
	quart3 = 5.0;

  
  //Graph
  
  // Map
	//UK : width/1.792 | height/0.461 | width/0.139
	//Europe : width/2.0906 / height/0.713 / width/0.2788
	//World : width/2 | height/1.4 | width/0.84
var xy = d3.geo.mercator(),
    path = d3.geo.path().projection(xy.translate([width/2,height/1.4]).scale(width/0.84)),
 diagonal = d3.svg.diagonal()
      .projection(function(d) { return xy([d.y, d.x]); });

	  var vis = d3.select("body")
  .append("svg:svg")
  .attr("fill", "none")
  .attr("height", height)
  .attr("stroke", "none")
  .on("dblclick", function() {d3.select("#connect").selectAll("path").attr("visibility", "visible");
							d3.select("#panel").selectAll("text").remove()});

	 
 var borders = vis.append("svg:svg").attr("id", "world");
 
d3.json("data/world.json", function(collection) {
  borders.selectAll("path")
      .data(collection.features)
    .enter().append("svg:path")
      .attr("d", path)
	  .attr("stroke", "white")
	  .attr("fill", "lightgrey")
	  .attr("opacity", 0.5)
	  //.attr("visibility", "hidden")
	  .attr("stroke-width", 0.3);
	  
	
	  	  
});
	

	  // pathes
	  
d3.csv("data/FR.csv", function(dataducsv) {

dataducsv.forEach(function(d) {

datae.push({

	flight:d.Product,
	session:parseFloat(d.Session),
	time:parseFloat(d.Time),
	revenue:parseFloat(d.Revenue)

})

})

  //scale
  //colors : color1 : 0xF1EEF6 // color 2 : 0xBDC9E1 // color 3 : 0x74A9CF // color 4 : 0x0570B0

 var  max = d3.max(datae, function(d) {return d.revenue;}),
	  min = d3.min(datae, function(d) {return d.revenue;}),
	  rayon = d3.scale.linear().domain([min, max]).range([1, 10]),
	  maxq = d3.max(datae, function(d) {return d.revenue;}),
	  minq = d3.min(datae, function(d) {return d.revenue;}),
	  maxS = d3.max(datae, function(d) {return d.session;}),
	  minS = d3.min(datae, function(d) {return d.session;}),
	  maxT = d3.max(datae, function(d) {return d.time;}),
	  minT = d3.min(datae, function(d) {return d.time;}),
	  thick = d3.scale.linear().domain([minq, maxq]).range([0.09, 0.8]),
	  size = d3.scale.linear().domain([minq, maxq]).range([1,3]),
	  color = d3.scale.linear().domain([minT, 5]).range(["blue","green"]);

var panel = vis.append("svg:svg")
	.append("svg:svg")
	.attr("height", height)
	.attr("fill", "none")
	.attr("id", "panel");
  
var label = vis.append("svg:svg")
				.attr("width", 700)
				.attr("height",50)
				.attr("id", label)
				.attr("x", 10)
				.attr("y", 100);
  
var legende = vis.append("svg:svg")
				.attr("width", 200)
				.attr("height",100)
				.attr("id", legende)
				.attr("x", 150)
				.attr("y", 150);
				
var countrys = vis.append("svg:svg")
				.attr("width", 300)
				.attr("height",50)
				.attr("x", 150)
				.attr("y", 280);

var legend = [{color:"rgb(5, 113, 176)",text:"1st Quartile  x < "+quart1},{color:"rgb(146, 197, 222)",text:"2nd Quartile"+" "+quart1+" "+"< x <"+" "+quart2},{color:"rgb(244, 165, 130)",text:"3rd Quartile"+" "+quart2+" "+"< x <"+" "+quart3},{color:"rgb(202, 0, 32)",text:"4th Quartile  x >"+" "+quart3}];
var titre = ["AF FR | Hesitation before purchase"];
var pays = ["World", "Europe", "France"];

legende.selectAll("rect")
	.data(legend)
.enter().append("svg:rect")
	.attr("width", 20)
	.attr("height",20)
	.attr("y", function(d,i) {return 20 + i*20;})
	.attr("opacity", 0.8)
	.attr("cursor", "pointer")
	.attr("fill", function(d) {return d.color;})
	.attr("strokewidth", 0)
	.on("click", function(d) {

				
					if (d.text == "2nd Quartile"+" "+quart1+" "+"< x <"+" "+quart2) {return d3.select("#connect").selectAll("path")
																		.filter(function(i) {return (i.session > quart2);})
																		.transition()
																		.attr("visibility", "hidden");
																		
																		}
																		
						else 
						
							if (d.text == "4th Quartile  x >"+" "+quart3) {return d3.select("#connect").selectAll("path")
																		.filter(function(i) {return (i.session < quart3);})
																		.transition()
																		.attr("visibility", "hidden");
																		
																		}
	
	});
	

legende.selectAll("text")
	.data(legend)
.enter().append("svg:text")
	.attr("x", 30)
	.attr("y", function(d,i) {return 35 + i*20;})
	.attr("text-anchor", "top")
	.attr("class", "polisse")
	.text(function (d) {return d.text;})

label.selectAll("text")
	.data(titre)
	.enter().append("svg:text")
	.attr("x",10)
	.attr("y", 20)
	.attr("class", "titre")
	.text(function(d) {return d;});
	
countrys.selectAll("rect")
	.data(pays)
.enter().append("svg:rect")
	.attr("width", 50)
	.attr("height", 20)
	.attr("cursor", "pointer")
	.attr("x", function(d,i) {return i*70;})
	.attr("text-anchor", "top")
	
	//UK : width/1.792 | height/0.461 | width/0.139
	//Europe : width/2.0906 / height/0.713 / width/0.2788
	//World : width/2 | height/1.4 | width/0.84
	
countrys.selectAll("text")
	.data(pays)
.enter().append("svg:text")
	.attr("y", 15)
	.attr("text-anchor", "middle")
	.on("click", function(d) { 
	
				if (d == "France") {return zoom(width/1.792, height/0.461, width/0.139);}
					else 
						if (d == "Europe") {return zoom(width/2.0906, height/0.713, width/0.2788);}
							else
								if (d == "World") {return zoom(width/2, height/1.4, width/0.84);}
								
								}
					
					)
	.attr("cursor", "pointer")
	.attr("x", function(d,i) {return 25 + i*70;})
	.attr("class", "polisse")
	.text(function (d) {return d;})



function zoom(x, y, z) {
var translate = xy.translate();
translate[0] = x;
translate[1] = y;

xy.translate(translate);
xy.scale(z);
refresh();

};

function refresh() {

remove_routes();

var world = d3.select("#world"),
	t = world.transition()
		.duration(500);

	t.selectAll("path")
	.attr("d", path);

var link = d3.select("#connect"),
	y = link.transition()
		.delay(700);
		
	y.selectAll("path")
	.attr("d", diagonal)
	.attr("visibility", "visible");
	

};


d3.csv("data/airport.csv", function(dataducsv) {
 
 var airport = dataducsv;
 
 datae.forEach(function(d) {
 
 flights[d.flight] = {
	o:d.flight.slice(0,3),
	d:d.flight.slice(3,6),
	origin: [],
	session: d.session,
	time: d.time,
	revenue: d.revenue,
	destination: []
	
	}
	
	})
 
 datae.forEach(function(i) {
 
 airport.forEach(function(t) {
 
 if (flights[i.flight].o == t.IATA)  {
 
  var cooo = [];
		  
	  cooo.push(parseFloat(t.longitude), parseFloat(t.latitude))
 
		 flights[i.flight].origin.push({
			name:i.flight.slice(0,3),
			label:t.label,
			coor:cooo	
			})

 
				;}				
				
})

 airport.forEach(function(u) {
 
 if (flights[i.flight].d == u.IATA)  {
 
  var cood = [];
		  
	  cood.push(parseFloat(u.longitude), parseFloat(u.latitude))
 
		 flights[i.flight].destination.push({
			name:i.flight.slice(3,6),
			label:u.label,
			coor:cood	
			});

 	
		
}				
				
})

connections.push({
	
		origin: flights[i.flight].o,
		destination: flights[i.flight].d,
		od: flights[i.flight].o+flights[i.flight].d,
		label:flights[i.flight].origin[0].label+" "+"-"+" "+flights[i.flight].destination[0].label,
		session : flights[i.flight].session,
		time: flights[i.flight].time,
		revenue: flights[i.flight].revenue,
	
		source:{
			x: flights[i.flight].origin[0].coor[1],
			y: flights[i.flight].origin[0].coor[0]
			},
		target:{
			x: flights[i.flight].destination[0].coor[1],
			y: flights[i.flight].destination[0].coor[0]
			}
			})

				})
	

	
	
var connect = vis.append("svg:svg")
				.attr("id","connect");


connect.selectAll("path.connect")
      .data(connections)
    .enter().append("svg:path")
	  .attr("d", diagonal)
	  .attr("opacity", function(d) {return thick(d.revenue);})
	  .attr("stroke-width", function(d) {return size(d.revenue);})
	  .attr("name", function(d) {return d.origin+d.destination;})
	  .attr("id", function(d) {return d.od;})
	  .on("click", function (d) {return fade(0, d.od);})
	  .on("mouseover", function(d) {return fademouse(1, d.od);})
	  .on("mouseout", function(d) {return fademouse(thick(d.revenue), d.od);})
	 // .attr("visibility", "hidden")
	  //.on("Dblclick", function (d) {return fade(1, d.od);})
	  .attr("stroke", function(d) { 
				
				if ( (d.session > 0)&&(d.session <= quart1)) {return "rgb(5, 113, 176)";}
				
					else
				
						if ((d.session > quart1)&&(d.session <= quart2)) {return "rgb(146, 197, 222)";}
						
							else 
					
								if ((quart2 < d.session)&&(d.session <=quart3)) {return "rgb(244, 165, 130)";}
									
									else
						
										if ((quart3 < d.session)) {return "rgb(202, 0, 32)";}
															
																			})	;	

		
		function fade(select, name) {
		
		connect.selectAll("path")
				.filter(function(i) {return  i.od != name;})
					.transition()
						.attr("visibility",function() {if (select==0) {return "hidden";}
													   if (select==1) {return "visible";}
														}); 
														
		d3.select("#panel").append("svg:text")
			.text("Route"+" "+" "+":"+" "+flights[name].origin[0].label+" "+"-"+" "+flights[name].destination[0].label)
					.attr("x", (xy(flights[name].destination[0].coor)[0]))
					.attr("y", (xy(flights[name].destination[0].coor)[1]))
					.attr("class", "legende")
	
		d3.select("#panel").append("svg:text")
			.text("Airport Code"+" "+" "+":"+" "+flights[name].o+" "+"-"+" "+flights[name].d)
					.attr("x", (xy(flights[name].destination[0].coor)[0]))
					.attr("y", (xy(flights[name].destination[0].coor)[1])+15)
					.attr("class", "legende")
		
		/*d3.select("#panel").append("svg:text")
			.text("Revenue"+" "+" "+":"+" "+mille((flights[name].revenue/1000).toFixed(1))+" "+"K€")
					.attr("x", (xy(flights[name].destination[0].coor)[0]))
					.attr("y", (xy(flights[name].destination[0].coor)[1])+30)
					.attr("class", "legende")*/
					
		d3.select("#panel").append("svg:text")
			.text("Number of sessions"+" "+" "+":"+" "+flights[name].session.toFixed(1))
					.attr("x", (xy(flights[name].destination[0].coor)[0]))
					.attr("y", (xy(flights[name].destination[0].coor)[1])+30)
					.attr("class", "legende")

		d3.select("#panel").append("svg:text")
			.text("Number of days"+" "+" "+":"+" "+flights[name].time.toFixed(1)+" "+"Days")
					.attr("x", (xy(flights[name].destination[0].coor)[0]))
					.attr("y", (xy(flights[name].destination[0].coor)[1])+45)
					.attr("class", "legende")
					
		/*d3.select("#panel").append("svg:text")
			.text("Evolution des ventes : - 10 %")
					.attr("x", (xy(flights[name].destination[0].coor)[0]))
					.attr("y", (xy(flights[name].destination[0].coor)[1])+75)
					.attr("class", "legende")
					
		d3.select("#panel").append("svg:text")
			.text("Contributeur : google / adwords")
					.attr("x", (xy(flights[name].destination[0].coor)[0]))
					.attr("y", (xy(flights[name].destination[0].coor)[1])+90)
					.attr("class", "legende")*/
					
					
					
														};
														
		
		function fademouse(opacity, name) {
		
				connect.select("#"+name)
					.attr("opacity", opacity);
														};
	
					
		
		/*.attr("stroke", function(d) { 
				
				if ( (d.time > 0)&&(d.time < 7)) {return "rgb(5, 113, 176)";}
				
					else
				
						if ((d.time > 7)&&(d.time < 9)) {return "rgb(146, 197, 222)";}
						
							else 
					
								if ((9 < d.time)&&(d.time < 11)) {return "rgb(244, 165, 130))";}
									
									else
						
										if ((11 < d.time)&&(d.time < 30)) {return "rgb(202, 0, 32)";}
															
																			})	;	*/																
 	  //.attr("stroke", function(d) {return color(d.session);});
	  //colors : color1 : (5, 113, 176) // color 2 : (146, 197, 222) // color 3 : (244, 165, 130) // color 4 : (202, 0, 32)
	//.attr("stroke", "rgb(203, 24, 29)");
	
	
	
			});
			
			});
			
			
// Additional functions

function add_routes() {

d3.select("#connect").selectAll("path").attr("visibility", "visible");

}

function remove_routes() {

d3.select("#connect").selectAll("path").attr("visibility", "hidden");

}

function add_borders() {

d3.select("#world").selectAll("path").attr("visibility", "visible");

}

function remove_borders() {

d3.select("#world").selectAll("path").attr("visibility", "hidden");

}
	
