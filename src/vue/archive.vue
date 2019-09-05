<template>
  <div id="archive-app">
    <section class="section header-offset fixed top-0 left-0 w-full">
      <div class="container">
        <div class="row justify-between">
          <div class="col lg:w-3/12 xl:w-2/12">
            <p class="text-sm mb-4">Specimen</p>
            <ul>
              <li v-on:click="removeFilter('project')">All</li>
              <li v-for="(project, index) in projects" v-bind:key="index" v-on:click="toggleFilter('project', project.title)">
                {{ project.title }}
                <span
                  v-if="project.count"
                  class="absolute text-xs ml-1"
                >{{ project.count }}</span>
              </li>
            </ul>
          </div>

          <div class="col lg:w-3/12 xl:w-2/12">
            <div class="row">
              <div class="col flex-grow">
                <p class="text-sm text-right mb-4">Type</p>
                <ul class="text-right">
                  <li v-on:click="removeFilter('category')">All</li>
                  <li v-for="(category, index) in categories" v-bind:key="index" v-on:click="toggleFilter('category', category.title)">
                    {{ category.title }}
                  </li>
                </ul>
              </div>

              <div class="col flex-shrink">
                <p class="text-sm text-right mb-4">Year</p>
                <ul class="text-right">
                  <li v-on:click="removeFilter('edition')">All</li>
                  <li v-for="(edition, index) in editions" v-bind:key="index" v-on:click="toggleFilter('edition', edition.title)">
                    {{ edition.title }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section header-offset">
      <div class="container">
        <div class="row">
          <div class="col md:w-6/12 md:ml-3/12 xl:w-8/12 xl:ml-2/12">
            <transition-group class="list row flex-wrap" name="list">

              <div v-for="(object, index) in objects" v-bind:key="index" class="list-item col w-full lg:w-6/12 mb-12" v-if="isVisible(object)">
                <div class="w-full bg-gray-500" style="padding-top: 150%"></div>
                <div class="flex justify-between mt-2">
                  <div>{{ object.edition }}</div>
                  <div class="text-right">
                    {{ object.projectTitle }}
                    <br />{{ object.category }}
                  </div>
                </div>
              </div>

            </transition-group>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      objects: [],
      categories: [],
      projects: [],
      editions: [],
      filters: {
        project: '',
        category: '',
        edition: ''
      }
    };
  },
  mounted() {
    axios
      .get("/objects.json")
      .then(response => {
        if (response.status == 200) {
          let objects = response.data.data;

          this.objects = objects.sort((a, b) => {
            return b.edition - a.edition
          })

          axios
            .get("/object-categories.json")
            .then(response => {
              if (response.status == 200) {
                this.categories = response.data.data;
              }
            })
            .catch(error => {
              console.log(error);
            });

          axios
            .get("/project-categories.json")
            .then(response => {
              if (response.status == 200) {
                this.projects = response.data.data;

                this.projects.forEach(project => {
                  project.count = this.countObjects(project);
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
          
          axios
            .get("/editions.json")
            .then(response => {
              if (response.status == 200) {
                this.editions = response.data.data;
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    countObjects(project) {
      return this.objects.filter(object => object.projectTitle == project.title)
        .length;
    },
    isVisible(object) {
      let isVisible = true
      
      if (this.filters.project != '' && this.filters.project != object.projectTitle) {
        isVisible = false;
      }
      if (this.filters.category != '' && this.filters.category != object.category) {
        isVisible = false;
      }
      if (this.filters.edition != '' && this.filters.edition != object.edition) {
        isVisible = false;
      }
      
      return isVisible
    },
    toggleFilter(type, filter) {
      switch (type) {
        case 'project':
          if (this.filters.project != filter) {
            this.filters.project = filter
          } else {
            this.filters.project = ''
          }
          break;
        case 'category':
          if (this.filters.category != filter) {
            this.filters.category = filter
          } else {
            this.filters.category = ''
          }
          break;
        case 'edition':
          if (this.filters.edition != filter) {
            this.filters.edition = filter
          } else {
            this.filters.edition = ''
          }
          break;  
      }
    },
    removeFilter(type) {
      switch (type) {
        case 'project':
            this.filters.project = ''
          break;
        case 'category':
            this.filters.category = ''
          break;
        case 'edition':
            this.filters.edition = ''
          break;  
      }
    }
  }
};
</script>

<style>

</style>
