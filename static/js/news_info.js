
function display_news_info(data_news){
    // console.log(data_news);
    var date = new Date(Date.parse(data_news.meta_data.article.published_time,"yyyy-MM-dd'T'HH:mm:ssXXX"));

    d3.select(".title_news")
    .html("<span>" + data_news.title + "</span>");

    // d3.select(".link_news")
    //     .html("<span><strong>Url : </strong>" + data_news.url+ "</span>");

    d3.select(".publish_date_news")
        .html("<span>" + date.toLocaleDateString()+ "</span>");
    d3.select(".text_news")
        .html(data_news.text)
}
