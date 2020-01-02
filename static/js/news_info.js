
function display_news_info(data_news){
    // console.log(data_news);
    try {
        var date_def = new Date(Date.parset(data_news.meta_data.article.published_time,"yyyy-MM-dd'T'HH:mm:ssXXX"));
        var date = date_def.toLocaleDateString()

    } catch(TypeError){
        console.log(TypeError)
        var date = "Not Available"
    }


    d3.select(".title_news")
    .html("<span>" + data_news.title + "</span>");

    // d3.select(".link_news")
    //     .html("<span><strong>Url : </strong>" + data_news.url+ "</span>");
    d3.select(".publish_date_news")
            .html("<span>" + date+ "</span>");

    d3.select(".text_news")
        .html(data_news.text)
}
