// variables 

var width = 960,
	height = 1200,
	maxChar = 15,
	nbCol = 191,
	widthCol = 60,
	offsetX = 10,
	seuil = 0.8,
	pourcent = d3.format("%");

// Build container

var container = d3.select("#main_container").append("svg:svg")
	.attr("width",width)
	.attr("height",height);
	
// Add tooltip 

var div = d3.select("#body_main").append("div")
    .attr("class", "tooltip")
    .style("opacity", 1e-6);

d3.csv("data/prediction.csv",function(prediction) {

prediction.sort(function(a,b) {return a.requete > b.requete;});

container.selectAll("text")
	.data(prediction)	
.enter().append("svg:text")
.attr("x",function(d,i) {return Math.floor(i/nbCol)*widthCol + offsetX;})
.attr("y", function(d,i) {return (i%nbCol)*(height/nbCol);})
.attr("class",function(d) { if (parseFloat(d.prediction)>seuil) { return "requete on";} else {return "requete";} })
.attr("prediction",function(d) {return parseFloat(d.prediction).toFixed(2);})
.text(function(d) {return (d.requete).substr(0,maxChar);})
.on("mouseout",function() {

			d3.select(this).attr("style","font-size:7px")

			div.transition()        
                .duration(0)      
                .style("opacity", 0);    

})

.on("click", function(d) {

			div.transition()            
                .style("opacity", 1);

           div .html( '<span class="nytg-popup" >'+
		'<div class="nytg-popup-title">'+ "Requete : " +d.requete+'</div>'+
		
		'<div class="nytg-popup-label">'+ "Localité : " + d.ou+'</div>'+
		
		
		'<table>'+
				'<tbody>'+
			
					'<tr>'+
						 '<td class="row2">' + "prediction" + '</td>' +
						 '<td class="row1">' + parseFloat(d.prediction).toFixed(2) + '</td>'+
					'</tr>'+
					'<tr>'+
						 '<td class="row2">' + "frequence" + '</td>' +
						 '<td class="row1">' + d.freq + '</td>'+
					'</tr>'+
					'<tr>'+
						 '<td class="row2">' + "affinage" + '</td>' +
						 '<td class="row1">' + pourcent(parseFloat(d.affinage)/100) + '</td>'+
					'</tr>'+
					'<tr>'+
						 '<td class="row2">' + "association" + '</td>' +
						 '<td class="row1">' + d.requeteAssociee + '</td>'+
					'</tr>'+
					
					
				'</tbody>'+
				
				
			'</table>'+
		
	'</span>')  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
} )

.on("mouseover", function(d) {      
            
            d3.select(this).attr("style","font-size:20px")

            })   
.attr("data-content",function(d) { return d.requeteAssociee;})



function mouseover() {
  div.transition()
      .duration(500)
      .style("opacity", 1);
}

function mousemove() {
  div
      .text(d3.event.pageX + ", " + d3.event.pageY)
      .style("left", (d3.event.pageX - 34) + "px")
      .style("top", (d3.event.pageY - 12) + "px");
}

function mouseout() {
  div.transition()
      .duration(500)
      .style("opacity", 1e-6);
}
				
});

// Introduction 

$(function() {

$("#seuilForm").keyup(function() {

var value = $(this).val();

if (value === "") {

d3.select("#seuilLabel h2").text("0");

} else if (value < 1) {

d3.select("#seuilLabel h2").text(value);
d3.selectAll("text").attr("class","requete");
d3.selectAll("text").filter(function(d) {return parseFloat(d.prediction) >= value;}).attr("class","requete on");


}

});

});