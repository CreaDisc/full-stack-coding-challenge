<template>
  <div class="menu">
    <h1>Menu</h1>
    <div class="card-grid">
      <div v-for="pizza in pizzas" v-bind:key="pizza.name" class="item-card">
        
        <h2>{{pizza.name}}</h2>

        <p>{{pizza.ingredients.join(', ')}} </p>

        <div class="item-amount">
          <button v-on:click="removePizza(pizza.name)">-</button>
          {{pizza.amount}}
          <button v-on:click="addPizza(pizza.name)">+</button>
        </div>

      </div>
    </div>
    

    <div class="item-card summary">
        <h2>Order Summary</h2>
        <div v-for="pizza in orderedPizzas" v-bind:key="pizza.name" class="item-list">
            <b>{{pizza.amount}} x {{pizza.name}} </b>
            ${{(pizza.price*pizza.amount).toFixed(2)}}
        </div>
        
        <div class="item-total">
          ${{ orderSummary.sum.toFixed(2) }} Total
        </div>

        
        <button v-on:click="sendOrder()" :class="{'hidden':!orderedPizzas.length}">Order for ${{ orderSummary.sum.toFixed(2) }}</button>
        

    </div>

    <section class="placed-order-summary" :class="{'hidden':!orderPlaced}">

      <div class="summary-modal">
        <h2>Thank You for Your Order</h2>
        <div v-for="pizza in lastOrder.content" v-bind:key="pizza.name" class="item-list">
            <b>{{pizza.amount}} x {{pizza.name}} </b>
            ${{(pizza.price*pizza.amount).toFixed(2)}}
        </div>
        
        <div class="item-total">
          ${{ lastOrder.sum.toFixed(2) }} Total
        </div>
        <button class="close" v-on:click="resetOrder()">Schließen</button>
      </div>
        
    </section>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      pizzas: [],
      orderPlaced: false,
      lastOrder: {
        content: [],
        sum: 0
      }
    }
  },
  computed: {
    orderedPizzas() {
      return this.pizzas.filter(p => p.amount > 0)
    },

    orderSummary() {
      const sum = this.orderedPizzas.map(p => p.price*p.amount).reduce((a,b) => a+b, 0)
      return {
        placed: this.orderPlaced,
        content: this.orderedPizzas,
        sum: sum
      }
    },
  },
  methods: {

      async loadItems() {
        const response = await fetch("api/pizzas")
        if(!response.ok) {
            console.error("failed to fetch menu items")
            return
        }
        const result = await response.json()
        this.pizzas = result.map(p => ({
          ...p,
          amount: 0
        }))
      },

      addPizza(name) {
        const pizza = this.pizzas.filter(p => p.name == name)[0]
        if(!pizza) {
          console.error("cannot add pizza "+name)
          console.log(this.pizzas)
        }

        pizza.amount++;
      },

      removePizza(name) {
        const pizza = this.pizzas.filter(p => p.name == name)[0]
        if(!pizza) {
          console.error("cannot add pizza "+name)
          console.log(this.pizzas)
        }

        pizza.amount = pizza.amount <= 0 ? 0 : pizza.amount-1;
      },

      async sendOrder() {
        const response = await fetch("api/pizzas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.orderedPizzas)
        })
        if(!response.ok) {
            console.error("failed to place order")
            return
        }
        const result = await response.json()
        this.orderPlaced = true
        this.lastOrder = {
          content: result,
          sum: this.orderSummary.sum
        }
        this.pizzas = this.pizzas.map(p => ({
          ...p,
          amount: 0
        }))
      },

      resetOrder() {
        this.orderPlaced = false;

      }

  },
  mounted() {
      this.loadItems()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.menu {
  box-sizing: border-box;
  padding: 1em;
}

.menu .card-grid {
  display: grid; 
  grid-template-columns: 1fr; 
  gap: 1em 1em; 

  text-align: center;
}

.item-card {
  display: block;
  padding: 1em;
  border: 2px solid #111;
  border-radius: 1em;
}

.item-card.summary {
  margin-top: 6em;
}

.item-list, .item-list b {
  display: block;
  margin-top: .5em;
}

.item-total {
  margin-bottom: 3em;
  margin-top: 1em;
  padding-top: 1em;
  border-top: 2px solid #000;
  font-weight: bold;
}

.item-card p {
  margin: 3em 2em;
  min-height: 3em;
}

.item-amount, .item-card.summary button, button.close {
  display: inline-block;
  color: #fff;
  border-radius: 1em;
  background: #111;
  font-size: 1.5rem;
}

.item-card.summary button, button.close {
  display: block;
  padding: 1em;
  font-size: 1rem;
  border: none;

  font-weight: bold;
}

.item-card.summary button.hidden {
  display: none;
}

.item-amount button {
  border: none;
  background: transparent;
  color: #fff;
  font-weight: bold;
  font-size: 1em;
  margin: 0em 1em;
}


.placed-order-summary {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  background: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
}

.placed-order-summary.hidden {
  display: none;
}

.summary-modal {
  width: 20em;
}

.placed-order-summary .item-total {
  border-color: #fff;
}

.placed-order-summary .item-list,
.placed-order-summary .item-total,
.placed-order-summary h2 {
  color: #fff;
}

.placed-order-summary button.close {
  background: #fff;
  color: #444;
}


@media screen and (min-width: 768px) {
  .menu .card-grid {
    grid-template-columns: 1fr 1fr; 
    gap: 2em 2em; 
  }
}

@media screen and (min-width: 1200px) {
  .menu .card-grid {
    grid-template-columns: 1fr 1fr 1fr; 
    gap: 3em 3em; 
  }
}
</style>
