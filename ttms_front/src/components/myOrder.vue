<script setup>
import router from '@/router'
import { formatDate } from '@/utils/data'
import { computed, inject } from 'vue'

const props = defineProps({
  id: [String, Number],
  date: String,
  name: String,
  hall: String,
  seat: Array,
  price: Number,
  type: Number, // 1=待支付 2=待完成 3=已退款 4=已完成 5=已过期
  img: String
})

const statusStr = computed(() => {
  const map = {
    1: '待支付',
    2: '待完成',
    3: '已退款',
    4: '已完成',
    5: '已过期'
  }
  return map[props.type] || ''
})

const backMoney = inject('backMoney')
const gotoPay = (id) => {
  router.push(`/orderShow?orderId=${id}`)
}
</script>

<template>
  <div class="myOrder">
    <div class="top">
      <div class="date">{{ formatDate(date) }}</div>
      <div class="id">订单号:{{ id }}</div>
    </div>
    <div class="main1">
      <div class="img"><img :src="img" alt="" /></div>
      <div class="detail">
        <div class="name">{{ name }}</div>
        <div class="hall">{{ hall }}</div>
      </div>
      <div class="seat">
        <div class="seatGro">
          <div v-for="s in seat" :key="s">{{ s }}</div>
        </div>
      </div>
      <div class="price">￥{{ price }}</div>
      <div class="status">{{ statusStr }}</div>
      <div class="opea">
        <!-- 已支付且影片未开场才能退款 -->
        <el-button type="primary" @click="backMoney(id)" v-if="type === 2"
          >退款</el-button
        >
        <!-- 待支付才显示去支付 -->
        <el-button type="primary" @click="gotoPay(id)" v-if="type === 1"
          >去支付</el-button
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.myOrder {
  height: 240px;
  border: 1px solid rgb(231, 231, 231);
  box-shadow: 5px 6px 10px 4px rgb(222, 222, 222);
  margin-top: 30px;
  .top {
    background-color: rgb(212, 212, 212);
    height: 50px;
    padding-left: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .date {
      margin-right: 40px;
    }
    .id {
      color: rgb(226, 147, 147);
    }
  }
  .main1 {
    height: 190px;
    padding: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(255, 255, 255);
    .img {
      width: 20%;
      img {
        width: 110px;
        height: 150px;
      }
    }
    .detail {
      width: 15%;
      height: 80%;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: flex-start;
      .name {
        font-size: 23px;
        color: red;
      }
      .hall,
      .seat {
        font-size: 12px;
        color: rgb(133, 133, 133);
      }
    }
    .seat {
      width: 18%;
    }
    .price {
      width: 10%;
      font-size: 20px;
      color: red;
    }
    .status {
      width: 20%;
    }
    .opea {
      width: 12%;
    }
  }
}
</style>
