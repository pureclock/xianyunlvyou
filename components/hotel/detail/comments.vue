<template>
  <div v-if="dataSource">
    <el-row v-for="c in dataSource" class="comment-item" :key="c.id">
      <el-col class="comment-user">
        <el-row type="flex">
          <el-col class="avatar-box">
            <img width="40" src="https://n4-q.mafengwo.net/s11/M00/64/81/wKgBEFsmE0WAPbqnAAAOwSUlOKY63.jpeg?imageMogr2%2Fthumbnail%2F%2196x96r%2Fgravity%2FCenter%2Fcrop%2F%2196x96%2Fquality%2F90" alt="">
          </el-col>
          <el-col class="nickname-box">
            <p class="nickname">{{c.account.nickname}}</p>
            <p class="user-level">LV.8</p>
          </el-col>
        </el-row>
        <el-row class="timestamp">
          {{timestamp(c.updated_at)}}
        </el-row>
      </el-col>

      <el-row class="comment-content">
        <div>
          <div class="pics">
            <ul>
              <li v-for="p in c.pics"><img :src="p.url" alt=""></li>
            </ul>
          </div>
          <div>
            {{c.content}}
          </div>
        </div>
        <div class="reply-box">
          <el-input
            type="textarea"
            :rows="1"
            resize="none"
            class="reply-input"
            placeholder="添加回复"
            @focus="handleInputFocus"
            @blur.stop="handleInputBlur"
          />
          <div class="reply-btn">
            <el-button size="mini" type="primary" @click="e => handleReply(e, c)">回复</el-button>
          </div>
        </div>

        <comments-view :userInfo="userInfo" :dataSource="c.followed" :hotel="hotel" :onCommit="onCommit" v-if="c.followed" />
      </el-row>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'comments-view',
    props: ['hotel', 'dataSource', 'userInfo', 'onCommit'],
    methods: {
      handleInputFocus(e) {
        const box = e.target.closest('.reply-box')
        if (box) {
          box.classList.add('active')
        }
      },
      handleInputBlur(e) {
        const box = e.target.closest('.reply-box')
        if (box) {
          setTimeout(() => {
            box.classList.remove('active')
          }, 10);
        }
      },
      handleReply(e, c) {
        const follow = c.id
        const textarea = e.target.closest('.reply-box').querySelector('textarea');
        const content = textarea.value;

        this.$axios({
          url: '/comments',
          method: 'post',
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.userInfo.jwt}`,
          },
          data: {
            account: this.userInfo.user,
            hotel: this.hotel.id,
            follow,
            content,
          }
        }).then(r => {
          c.followed = c.followed || []
          c.followed.push(r.data)
          setTimeout(function() {
            textarea.value = ''
          }, 10);
        })
      },
      timestamp(ts) {
        const d = new Date(+ts)
        return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-')
      }
    },
  }
</script>

<style scoped lang="less">
  .comments-hd {
    font-size: x-large;
    margin-top: 30px;
  }

  .comment-item {
    border-top: 1px dashed #eee;
    padding: 20px 0;
    margin-top: 10px;
  }
  .comment-user {
    width: 110px;
    .nickname {
      color: #fa3;
    }
    .timestamp {
      color: #666;
      font-size: 14px;
    }
    .user-level {
      font-size: 12px;
      color: #f30;
      margin-top: 6px;
    }
    img {
      display: inline-block;
      border-radius: 50%;
      border: 2px solid #fa3;
    }
  }
  .comment-content {
    overflow: hidden;
    color: #666;
  }
  .reply-btn {
    text-align: right;
    display: none;
    margin-top: 10px;
  }
  .reply-box {
    margin-top: 10px;
    &.active {
      .reply-btn {
        display: block;
      }
    }
  }
  /deep/ .el-textarea__inner {
    transition: all .25s;
    &:focus {
      min-height: 6em !important;
    }
  }
</style>
