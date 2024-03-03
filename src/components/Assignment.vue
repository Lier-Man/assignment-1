<template>
  <div class="container">
    <h1>Fabbi Vue Assignment 1</h1>
    <div class="mt-8">
      <v-stepper v-model="step" :items="steps">
        <template v-slot:item.1>
          <v-card>
            <v-form v-model="valid1" ref="form1Ref">
              <v-card-title>
                <h3>Please select a Meal</h3>
              </v-card-title>
              <v-card-actions>
                <v-select
                  v-model="meal"
                  label="Select a Meal"
                  :rules="[rules.required]"
                  :items="['Breakfast', 'Dinner', 'Lunch']"
                ></v-select>
              </v-card-actions>
              <v-card-title>
                <h3>Please enter Number of people</h3>
              </v-card-title>
              <v-card-actions>
                <v-text-field
                  v-model="numOfPeople"
                  :rules="[rules.number]"
                  type="number"
                ></v-text-field>
              </v-card-actions>
            </v-form>
          </v-card>
        </template>

        <template v-slot:item.2>
          <v-card>
            <v-form v-model="valid2" ref="form2Ref">
              <v-card-title>
                <h3>Please select a Restaurant</h3>
              </v-card-title>
              <v-card-actions>
                <v-select
                  v-model="restaurant"
                  label="Select a Restaurant"
                  :rules="[rules.required]"
                  :items="restaurantOptions"
                ></v-select>
              </v-card-actions>
            </v-form>
          </v-card>
        </template>

        <template v-slot:item.3>
          <v-card>
            <v-form v-model="valid3" ref="form3Ref">
              <v-row>
                <v-col cols="12" md="6">
                  <h3>Please select a Dish</h3>
                  <v-select
                    class="mt-4"
                    v-model="dish"
                    label="Select a Dish"
                    :items="dishOptions"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <h3>Please enter no of serving</h3>
                  <v-text-field
                    class="mt-4"
                    v-model="noOfServing"
                    :rules="[rules.number]"
                    type="number"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-btn class="mx-4 my-2" icon="mdi-plus" @click="addDish"></v-btn>
                  <p v-if="error" class="text-error">
                    {{ error }}
                  </p>
                </v-col>
              </v-row>
              <v-row v-if="dishes">
                <v-col>
                  <v-list>
                    <v-list-item v-for="(item, index) in dishes" :key="index">
                      <template v-slot:append>
                        <v-icon icon="mdi-close" @click="deleteDish(item)"></v-icon>
                      </template>
                      {{ item.dish }} - {{ item.noOfServing }}
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </template>

        <template v-slot:item.4>
          <v-card>
            <v-form>
              <v-row>
                <v-col cols="12" md="6" class="text-center">
                  <h3>Meal</h3>
                </v-col>
                <v-col cols="12" md="6">
                  <h4>{{ meal }}</h4>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6" class="text-center">
                  <h3>No of People</h3>
                </v-col>
                <v-col cols="12" md="6">
                  <h4>{{ numOfPeople }}</h4>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6" class="text-center">
                  <h3>Restaurant</h3>
                </v-col>
                <v-col cols="12" md="6">
                  <h4>{{ restaurant }}</h4>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6" class="text-center">
                  <h3>Dishes</h3>
                </v-col>
                <v-col cols="12" md="6">
                  <v-list style="border: 1px solid; width: fit-content">
                    <v-list-item v-for="(item, index) in dishes" :key="index">
                      {{ item.dish }} - {{ item.noOfServing }}
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </template>

        <template v-slot:actions>
          <v-card>
            <v-card-actions>
              <v-btn v-if="step > 1" color="primary" @click="previousStep"> Previous </v-btn>
              <v-spacer></v-spacer>
              <v-btn v-if="step !== steps.length" color="primary" @click="nextStep"> Next </v-btn>
              <v-btn v-if="step === steps.length" color="green" @click="submit"> Submit </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-stepper>
    </div>

    <v-dialog v-if="dialog" v-model="dialog" max-width="400" persistent>
      <v-card>
        <v-card-title>
          <p class="text-success">Submit Success!</p>
        </v-card-title>
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="dialog = false"> Ok </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { metaProperty } from '@babel/types';
import { ref, onMounted, reactive } from 'vue';
const steps = ref(['Step 1', 'Step 2', 'Step 3', 'Review']);
const step = ref(1);
const masterData = ref([]);
const rules = {
  number: (value) => {
    if (value > 0 && value < 11) return true;
    return 'The number of people must be between 1 and 10.';
  },
  required: (value) => {
    return value && value.length > 0 ? true : 'Field is required';
  },
};
//step 1
const meal = ref(null);
const numOfPeople = ref(0);
const valid1 = ref(false);
const form1Ref = ref(null);
//step 2
const restaurant = ref(null);
const valid2 = ref(false);
const form2Ref = ref(null);
const restaurantOptions = ref([]);
//step 3
const dish = ref(null);
const noOfServing = ref(1);
const valid3 = ref(false);
const form3Ref = ref(null);
const dishOptions = ref([]);
const dishes = ref([]);
const error = ref(null);
//step 4
const dialog = ref(false);

const getData = async () => {
  await fetch('data/dishes.json').then(async (res) => {
    const data = await res.json();
    masterData.value = data.dishes;
  });
};

const onNext = () => {
  if (step.value < steps.value.length) {
    step.value++;
  }
};

const previousStep = () => {
  if (step.value > 0) {
    step.value--;
  }
};

const getDataRestaurant = (meal) => {
  restaurantOptions.value = [];
  masterData.value.map((item) => {
    if (item.availableMeals.includes(meal.toLowerCase())) {
      if (!restaurantOptions.value.includes(item.restaurant)) {
        restaurantOptions.value.push(item.restaurant);
      }
    }
  });
};

const getDataDish = (meal, restaurant) => {
  dishOptions.value = [];
  masterData.value.map((item) => {
    if (item.availableMeals.includes(meal.toLowerCase()) && item.restaurant === restaurant) {
      dishOptions.value.push(item.name);
    }
  });
};

const addDish = () => {
  if (dish.value && noOfServing.value > 0 && noOfServing.value < 11) {
    const item = {
      dish: dish.value,
      noOfServing: noOfServing.value,
    };
    dishes.value.push(item);
    dishOptions.value = dishOptions.value.filter((i) => i.indexOf(dish.value) === -1);
    dish.value = null;
    noOfServing.value = 1;
  }
};

const deleteDish = (item) => {
  dishes.value = dishes.value.filter((i) => i.dish.indexOf(item.dish) === -1);
  dishOptions.value.push(item.dish);
};

const nextStep = () => {
  if (step.value === 1) {
    form1Ref.value.validate();
    if (!valid1.value) return;
    getDataRestaurant(meal.value);
    onNext();
  }

  if (step.value === 2) {
    form2Ref.value.validate();
    if (!valid2.value) return;
    getDataDish(meal.value, restaurant.value);
    onNext();
  }

  if (step.value === 3) {
    error.value = null;
    if (dishes.value.length == 0) {
      error.value =
        'You have to select the dish and the number of servings, then click the add button to add it to the list';
      return;
    }
    let count = 0;
    dishes.value.map((item) => {
      count += parseInt(item.noOfServing);
    });
    if (count < numOfPeople.value || count > 10) {
      error.value =
        'The total number of dishes (i.e Number of dishes * respective serving) should be greater or equal to the number of people selected in the first step and a maximum of 10 is allowed.';
      return;
    }
    onNext();
  }
};

const resetForm = () => {
  step.value = 1;
  meal.value = null;
  numOfPeople.value = 0;
  restaurant.value = null;
  dish.value = null;
  noOfServing.value = 1;
  dishes.value = [];
  error.value = null;
};

const submit = () => {
  const formSubmit = {
    meal: meal.value,
    restaurant: restaurant.value,
    dishes: dishes.value,
    numOfPeople: numOfPeople.value,
  };
  console.log(formSubmit);
  dialog.value = true;
  resetForm();
};

onMounted(() => {
  getData();
});
</script>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  max-width: 1200px;
  padding: 36px;
  height: 100vh;
}
h1 {
  text-align: center;
}
</style>
