// default values

const node_internal_default_color = '#EF7325' // To synch with css
    , node_default_color = '#E56A23' // To synch with css
    , path_default_color = '#E56A23' // To synch with css
    , node_highlight_color = '#FFA500'
    , path_highlight_color = '#FFA500'
    , unzoom_factor = 0.98;

var  relatif_angle = 0
   , zoom_area_function = 0
   , data;


var svg = d3.select(".tree_graph")
  , width = svg.node().getBoundingClientRect().width
  , height = svg.node().getBoundingClientRect().height
  , radius = 0.5*unzoom_factor*Math.min(width,height)
  , g = svg.append("g")
              .attr("transform", "translate(" + (width / 2 ) + "," + (height / 2) + ")")
              .attr("class", 'node root');


// var tip = d3.tip()
//             .attr('id', 'tip')
//             .html(function(d) {return "<strong>" + d.id +"</strong>;"});
//             // .rootElement(document.getElementById('node_info'))
//             // .offset([10, 0])

// svg.call(tip);

// document.getElementById('node_info').appendChild(
//   document.getElementById('tip')
// );

var stratify = d3.stratify()
    .parentId(function(d) {
      if (d.parent == ""){
        return undefined;
      }else {
        return d.parent;
      }
    })
    .id(function(d){
      return d.id;
    });

// var stratify = d3.stratify()
//     .parentId(function(d) {
//       var ids_list = d.id.split('.');
//       ids_list.pop();
//       return ids_list.pop();
//     })
//     .id(function(d){
//       // console.log(d.id.split('.').pop());
//       return d.id.split('.').pop();
//     });

var circular_tree = d3.tree()
    .size([360, radius]) // size([degree, radius]) because we transform linear in circular
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

function draw_radial_tree_graph(data){

  var root = circular_tree(stratify(data));

  node_root = root.descendants().filter(function(d) {return d.depth == 0}).pop();
  nodes_tweet = root.descendants().filter(function(d) {return d.depth == 1});
  nodes_retweet = root.descendants().filter(function(d) {return d.depth == 2});






  // Bind data to root element and create root circle
  g.data([node_root])
      .append("circle")
      .attr("id", d => "node-" + d.id)
        .attr('r',5)
        .attr('transform','translate(0,0)');

  // Create first level node (tweets):
  nodes_1 = g.selectAll(".node .node-level-1")
    .data(nodes_tweet)
    .enter()
      .append('g')
      .attr('class', 'node node-level-1')
      .attr('id', d => 'node-'+ d.id);

  nodes_1.append('path')
          .attr("class", "link")
          .attr("d", function(d) {return path(d.x,d.y,d.parent.x,d.parent.y);})
          .on('mouseover', d => highlight_path(d,1))
          .on('mouseout', d => unhighlight_path(d,1))
          .on('click', d => console.log(d));

  nodes_1.append("circle")
            .attr("r", 2.5)
            .attr("transform", function(d) {
                      return "translate(" + project(d.x, d.y) + ")";
                });

  nodes_2 = nodes_1.filter(function(d) {return d.height==1})
            .attr('class', 'node node-level-1 node-internal');
  nodes_2.each(function(d){
    var nodes_2 = d3.select(this).selectAll(".node-level-2")
        .data(d.children).enter()
        .append('g')
          .attr('class','node node-level-2')
          .attr('id', d => 'node-' + d.id)

        nodes_2.append('path')
                .attr("class", "link")
                .attr("d", function(d) {return path(d.x,d.y,d.parent.x,d.parent.y);})
                .on('mouseover', function(d){
                                  mouseover(d);
                                  // tip.show(d)
                                  highlight_path(d,2)
                })
                .on('mouseout', function(d){
                                  // tip.hide(d)
                                  unhighlight_path(d,2)
                })
                .on('click', d => draw_linear_tree_graph(d.parent.id));

        nodes_2.append("circle")
          .attr("r", 2.5)
          .attr("transform", function(d) {
                    return "translate(" + project(d.x, d.y) + ")";
              });
        });
  svg.on('contextmenu',function(){

  if (zoom_area_function == 0) {
      var center_coordinates = d3.select(".root > circle")
                             .node().getBoundingClientRect(),
      coordinates = d3.mouse(this);
      go_to_zoom_mode(center_coordinates, coordinates);
      zoom_area_function = 1;
  } else {
      go_to_unzoom_mode();
      zoom_area_function = 0;
  }
});

svg.on('wheel', function(){
  if (zoom_area_function == 1) {
    rotation_angle = event.deltaY
    relatif_angle += rotation_angle/3
    d3.selectAll(".node-level-1 > circle, .node-level-2 > circle, .root > circle")
      .attr("transform",function(d){return "translate(" + project(d.x, d.y,relatif_angle, 3, cx + radius, 0) +") ";});
  d3.selectAll(".link")
      .attr("d", function(d) {return path(d.x,d.y,d.parent.x,d.parent.y,relatif_angle, 3 , cx + radius, 0);})
      }
})
}


function highlight_path(d, level){
  if (level == 1) {
    target_class = "#node-"+ d.id ;
  } else if (level == 2) {
    target_class = "#node-"+ d.parent.id ;
  }
  d3.select(target_class)
      .selectAll('.link')
      .style("stroke",path_highlight_color)
      .style("stroke-opacity","0.9")
      .style("stroke-width","2px");
  d3.select(target_class)
      .selectAll('circle')
      .attr("r", 5)
      .style("fill",node_highlight_color);
}

function unhighlight_path(d, level){
  if (level == 1) {
    target_class = "#node-"+ d.id ;
  } else if (level == 2) {
    target_class = "#node-"+ d.parent.id ;
  }

  d3.select(target_class)
      .selectAll('.link')
      .style("stroke",path_default_color)
      .style("stroke-opacity","0.4")
      .style("stroke-width","1.5px");
  d3.select(target_class)
      .selectAll('circle')
      .attr("r", 2.5)
      .style("fill",node_default_color);
  d3.select(target_class)
      .selectAll('.node-internal > circle')
      .style("fill",node_internal_default_color);
}

function project(x, y, offset_angle = 0, zoom_factor = 1, cx = 0, cy = 0) {
  var angle = (x - 90 - offset_angle) / 180 * Math.PI, radius = zoom_factor * y;
  return [radius * Math.cos(angle) - cx, radius * Math.sin(angle) - cy];
}

function path(target_x, target_y, origin_x, origin_y, offset_angle = 0, zoom_factor = 1 , cx = 0 , cy =0){
  // For path (class link) DOM object
  return "M" + project(target_x, target_y, offset_angle, zoom_factor, cx , cy)
      +  "C" + project(target_x, (target_y + origin_y) / 2, offset_angle, zoom_factor, cx , cy)
      +  " " + project(origin_x, (target_y + origin_y) / 2, offset_angle, zoom_factor, cx , cy)
      +  " " + project(origin_x, origin_y, offset_angle, zoom_factor, cx , cy) ;
}

function go_to_zoom_mode(center_coordinates, coordinates){

      cx = center_coordinates.x,
      cy = center_coordinates.y,
      current_x = coordinates[0],
      current_y = coordinates[1],
      diff_x = current_x - cx,
      diff_y = current_y - cy;

  if(diff_x > 0){
    var current_angle = 180 * Math.atan((coordinates[1]-center_coordinates.y)/(coordinates[0]-center_coordinates.x))/Math.PI;
  }else {
    var current_angle = 180 + 180*Math.atan((coordinates[1]-center_coordinates.y)/(coordinates[0]-center_coordinates.x))/Math.PI ;
  }

  relatif_angle += current_angle

  d3.selectAll(".node-level-1 > circle, .node-level-2 > circle, .root > circle")
      .transition()
      .duration(4000)
      .attr("transform",function(d){return "translate(" + project(d.x, d.y,relatif_angle, 3, cx + radius, 0) +") ";});
  d3.selectAll(".link")
    .transition()
    .duration(4000)
    .attr("d", function(d) {return path(d.x,d.y,d.parent.x,d.parent.y,relatif_angle, 3 , cx + radius, 0);})
}

function go_to_unzoom_mode(){
  d3.selectAll(".node-level-1 > circle, .node-level-2 > circle, .root > circle")
      .transition()
      .duration(2000)
      .attr("transform",function(d){return "translate(" + project(d.x, d.y, relatif_angle) +") ";});
  d3.selectAll(".link")
    .transition()
    .duration(2000)
    .attr("d", function(d) {return path(d.x,d.y,d.parent.x,d.parent.y, relatif_angle);})
}
