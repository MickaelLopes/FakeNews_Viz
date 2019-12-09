var Tooltip_tweet = d3.select("#node_tip_info")
                        .append("div")
                        .style("opacity", 0)
                        .attr("class","tooltip");
function mouseover(d){
    var date = new Date(Date.parse(d.parent.data.created_at, "ddd MMM DD HH:mm:ss +0000 YYYY"));
    Tooltip_tweet
      .style("opacity", 1)
      .html("<span><strong>Username</strong>: " + d.parent.data.screen_name + "<br>"
                + "<strong>Created at</strong>: " + date.toLocaleString() + "<br>"
                + "<strong>Tweet:</strong> " + d.parent.data.text
                +"</span>");
}
