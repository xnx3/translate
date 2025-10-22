<template>
  <div class="goods">
    <van-swipe class="goods-swipe" :autoplay="3000">
      <van-swipe-item v-for="thumb in goods.thumb" :key="thumb">
        <img :src="thumb" />
      </van-swipe-item>
    </van-swipe>

    <van-cell-group>
      <van-cell>
        <template #title>
          <div class="goods-title">{{ goods.title }}</div>
          <div class="goods-price">{{ formatPrice() }}</div>
        </template>
      </van-cell>
      <van-cell class="goods-express">
        <template #title>
          <van-col span="10">运费：{{ goods.express }}</van-col>
          <van-col span="14">剩余：{{ goods.remain }}</van-col>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group class="goods-cell-group">
      <van-cell
        value="进入店铺"
        icon="shop-o"
        is-link
        @click="sorry('进入店铺~')"
      >
        <template #title>
          <span class="van-cell-text">有赞的店</span>
          <van-tag class="goods-tag" type="danger">官方</van-tag>
        </template>
      </van-cell>
      <van-cell
        title="线下门店"
        icon="location-o"
        is-link
        @click="sorry('线下门店~')"
      />
      <van-cell title="会员中心" icon="user-o" is-link @click="onClickMember" />
    </van-cell-group>

    <van-cell-group class="goods-cell-group">
      <van-cell title="查看商品详情" is-link @click="sorry('查看商品详情~')" />
    </van-cell-group>

    <van-action-bar>
      <van-action-bar-icon icon="chat-o" @click="sorry('客服~')">
        客服
      </van-action-bar-icon>
      <van-action-bar-icon icon="cart-o" @click="onClickCart">
        购物车
      </van-action-bar-icon>
      <van-action-bar-button type="warning" @click="sorry('加入购物车~')">
        加入购物车
      </van-action-bar-button>
      <van-action-bar-button type="danger" @click="sorry('立即购买~')">
        立即购买
      </van-action-bar-button>
    </van-action-bar>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import router from '@/router';
import { showToast } from 'vant';

import type { IGoods } from '@/types';

const goods = reactive<IGoods>({
  title: '美国伽力果（约680g/3个）',
  price: 2680,
  express: '免运费',
  remain: 19,
  thumb: [
    'https://img.yzcdn.cn/public_files/2017/10/24/e5a5a02309a41f9f5def56684808d9ae.jpeg',
    'https://img.yzcdn.cn/public_files/2017/10/24/1791ba14088f9c2be8c610d0a6cc0f93.jpeg',
  ],
});

const formatPrice = () => {
  return '¥' + (goods.price / 100).toFixed(2);
};

const onClickMember = () => {
  router.push('user');
};

const onClickCart = () => {
  router.push('cart');
};

const sorry = (text: string = '暂无后续逻辑~') => {
  showToast(text);
};
</script>

<style lang="scss">
.goods {
  padding-bottom: 50px;

  &-swipe {
    img {
      width: 100%;
      display: block;
    }
  }

  &-title {
    font-size: 16px;
  }

  &-price {
    color: #f44;
  }

  &-express {
    color: #999;
    font-size: 12px;
    padding: 5px 15px;
  }

  &-cell-group {
    margin: 15px 0;

    .van-cell__value {
      color: #999;
    }
  }

  &-tag {
    margin-left: 5px;
  }
}
</style>
