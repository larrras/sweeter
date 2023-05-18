function post() {
    let comment = $('#textarea-post').val()
    let today = new Date().toISOString()
    $.ajax({
        type: 'POST',
        url: '/posting',
        data: {
            comment_give: comment,
            date_give: today,
        },
        success: function (response) {
            $('#modal-post').removeClass('is-active')
            window.location.reload()
        }
    })
}

function time2str(date) {
    let today = new Date();
    let time = (today - date) / 1000 / 60;
    if (time < 60) {
        return parseInt(time) + 'minutes ago'
    }
    time = time / 60
    if (time < 24) {
        return parseInt(time) + 'hours ago'
    }
    time = time / 24
    if (time < 7) {
        return parseInt(time) + 'days ago'
    }
    let year = date.getFullYear();
    // +1 karena bulan dalam JS dimulai dari nol (Januari = 0)
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${year}.${month}.${day}`
}

function num2str(count) {
    if (count > 10000) {
        return parseInt(count / 1000) + 'k'
    }
    if (count > 500) {
        // 1000 -> 100 -> 1 + k 
        // 550 -> 5 -> 0.5 + k
        return parseInt(count / 100) / 10 + 'k'
    }
    if (count == 0) {
        return ''
    }
    return count
}

function get_posts(username) {
    if (username === undefined) {
        username = ''
    }
    $('#post-box').empty()
    $.ajax({
        type: 'GET',
        url: `/get_posts?username_give=${username}`,
        data: {},
        success: function (response) {
            if (response['result'] === 'success') {
                let posts = response['posts']
                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i]
                    let time_post = new Date(post['date'])
                    let time_before = time2str(time_post)
                    let class_heart = post['heart_by_me'] ? 'fa-heart' : 'fa-heart-o';
                    let class_bookmark = post['bookmark_by_me'] ? 'fa-bookmark' : 'fa-bookmark-o';
                    let class_thumbsup = post['thumbsup_by_me'] ? 'fa-thumbs-up' : 'fa-thumbs-o-up';
                    
                    let html_temp = `
                    <div class="box" id="${post['_id']}">
        <article class="media">
            <div class="media-left">
                <a class="image is-64x64" href="/user/${post['username']}">
                    <img class="is-rounded"
                        src="/static/${post['profile_pic_real']}"
                        alt="Image">
                </a>
            </div>
            <div class="media-content">
                <div class="content">
                    <p>
                        <strong>${post['profile_name']}</strong><small>   @${post['username']}</small>
                        <small>${time_before}</small>
                        <br />
                        ${post['comment']}
                    </p>
                </div>
                <nav class="level is-mobile">
                    <div class="level-left">
                        <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${post["_id"]}', 'heart')">
                            <span class="icon is-small">
                                <i class="fa ${class_heart}" area-hidden="true"></i>
                            </span>&nbsp;<span class="like-num">${num2str(post['count_heart'])}</span>
                        </a>

                        <a class="level-item is-sparta" aria-label="bookmark" onclick="toggle_bookmark('${post["_id"]}', 'bookmark')">
                            <span class="icon is-small">
                                <i class="fa ${class_bookmark}" area-hidden="true"></i>
                            </span>&nbsp;<span class="like-num">${num2str(post['count_bookmark'])}</span>
                        </a>

                        <a class="level-item is-sparta" aria-label="thumbsup" onclick="toggle_thumbsup('${post["_id"]}', 'thumbsup')">
                            <span class="icon is-small">
                                <i class="fa ${class_thumbsup}" area-hidden="true"></i>
                            </span>&nbsp;<span class="like-num">${num2str(post['count_thumbsup'])}</span>
                        </a>
                
                    </div>
                </nav>
            </div>
        </article>
    </div>
                    `;
                    $('#post-box').append(html_temp)
                }
            }
        }
    })
}

function toggle_like(post_id, type) {
    let $a_like = $(`#${post_id} a[aria-label='heart']`);
    let $i_like = $a_like.find('i');
    if ($i_like.hasClass('fa-heart')) {
        $.ajax({
            type: 'POST',
            url: '/update_like',
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: 'unlike',
            },
            success: function (response) {
                $i_like.addClass('fa-heart-o').removeClass('fa-heart')
                $a_like.find('span.like-num').text(num2str(response['count']))
            }
        })
    } else {
        $.ajax({
            type: 'POST',
            url: '/update_like',
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: 'like',
            },
            success: function (response) {
                $i_like.addClass('fa-heart').removeClass('fa-heart-o')
                $a_like.find('span.like-num').text(num2str(response['count']))
            }
        })
    }
}

function toggle_bookmark(post_id, type) {
    let $a_like = $(`#${post_id} a[aria-label='bookmark']`);
    let $i_like = $a_like.find('i');
    if ($i_like.hasClass('fa-bookmark')) {
        $.ajax({
            type: 'POST',
            url: '/update_like',
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: 'unlike',
            },
            success: function (response) {
                $i_like.addClass('fa-bookmark-o').removeClass('fa-bookmark')
                $a_like.find('span.like-num').text(num2str(response['count']))
            }
        })
    } else {
        $.ajax({
            type: 'POST',
            url: '/update_like',
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: 'like',
            },
            success: function (response) {
                $i_like.addClass('fa-bookmark').removeClass('fa-bookmark-o')
                $a_like.find('span.like-num').text(num2str(response['count']))
            }
        })
    }
}

function toggle_thumbsup(post_id, type) {
    let $a_like = $(`#${post_id} a[aria-label='thumbsup']`);
    let $i_like = $a_like.find('i');
    if ($i_like.hasClass('fa-thumbs-up')) {
        $.ajax({
            type: 'POST',
            url: '/update_like',
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: 'unlike',
            },
            success: function (response) {
                $i_like.addClass('fa-thumbs-o-up').removeClass('fa-thumbs-up')
                $a_like.find('span.like-num').text(num2str(response['count']))
            }
        })
    } else {
        $.ajax({
            type: 'POST',
            url: '/update_like',
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: 'like',
            },
            success: function (response) {
                $i_like.addClass('fa-thumbs-up').removeClass('fa-thumbs-o-up')
                $a_like.find('span.like-num').text(num2str(response['count']))
            }
        })
    }
}