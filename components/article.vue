<template>
    <div class="article">
        <div class="article-title">{{ data.title }}</div>
        <div class="article-content" v-html="data.body"></div>
        <div class="article-comments">
            <span @click="showComments = !showComments" v-show="comments.length">短评（{{ comments.length }}）</span>
            <div class="article-comment" v-show="showComments" v-for="comment in comments">
                <div class="article-comment-avatar">
                    <img :src="comment.avatar">
                </div>
                <div class="article-comment-content">
                    <div class="article-comment-name">{{ comment.author }}</div>
                    <div class="article-comment-time" v-time="comment.time"></div>
                    <div class="article-comment-text">{{ comment.content }}</div>
                </div>
            </div>
        </div>
    </div>        
</template>
<script>
    import $ from '../libs/util';
    import Time from '../directives/time';
    export default {
        directives: { Time },
        props: {
            id: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                data: {},
                showComments: false,
                comments: []
            }
        },
        methods: {
            getArticle () {
                this.showComments = false;
                $.ajax.get('news/' + this.id).then(res => {
                    res.body = res.body.replace(/src="http/g, 'src="' + $.imgPath + 'http')
                    res.body = res.body.replace(/src="https/g, 'src="' + $.imgPath + 'https')
                    this.data = res;
                    // 返回文章顶端
                    window.scrollTo(0, 0);
                    this.getComments();
                });
            },
            getComments () {
                this.comments = [];
                $.ajax.get('story/' + this.id + '/short-comments').then(res => {
                    this.comments = res.comments.map(comment => {
                        comment.avatar = $.imgPath + comment.avatar;
                        return comment;
                    });
                });
            }
        },
        watch: {
            id (val) {
                if (val) this.getArticle();
            }
        }
    }
</script>
<style>
    span {
        cursor: pointer;
    }
</style>