var Tooltip_tweet = d3.select("#node_tip_info")
                        .append("div")
                        .style("opacity", 0)
                        .attr("class","tooltip")
                        .style("background-color", "black")
                        .style("width","250px")
                        .style("height","150px");
function mouseover(d){
    console.log("yo")
    Tooltip_tweet
      .style("opacity", 1)
      .html("<strong>" + d.parent.data.screen_name +"</strong>;");
}
