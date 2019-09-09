<template>
  <div id="archive-app">
    <section class="section blur-wrapper header-offset fixed top-0 left-0 w-full pointer-events-none z-20">
      <div class="container">
        <div class="row justify-between">
          <div class="col lg:w-3/12 xl:w-2/12">
            <p class="text-sm mb-4">Specimen</p>
            <ul class="pointer-events-auto">
              <li v-on:click="removeFilter('project')">All</li>
              <li
                v-for="(project, index) in projects"
                v-bind:key="index"
                v-on:click="toggleFilter('project', project.slug)"
              >
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
                <ul class="text-right pointer-events-auto">
                  <li v-on:click="removeFilter('category')">All</li>
                  <li
                    v-for="(category, index) in categories"
                    v-bind:key="index"
                    v-on:click="toggleFilter('category', category.slug)"
                  >{{ category.title }}</li>
                </ul>
              </div>

              <div class="col flex-shrink">
                <p class="text-sm text-right mb-4">Year</p>
                <ul class="text-right pointer-events-auto">
                  <li v-on:click="removeFilter('edition')">All</li>
                  <li
                    v-for="(edition, index) in editions"
                    v-bind:key="index"
                    v-on:click="toggleFilter('edition', edition.slug)"
                  >{{ edition.title }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section blur-wrapper header-offset z-10">
      <div class="container">
        <div class="row">
          <div class="col md:w-6/12 md:ml-3/12 xl:w-8/12 xl:ml-2/12">
            <transition-group class="list row flex-wrap" name="list">
              <div
                v-for="(object, index) in objects"
                v-bind:key="index"
                class="list-item col w-full lg:w-6/12 mb-12"
                v-if="isVisible(object)"
              >
                <a :href="object.url">
                  <figure class="w-full portrait">
                    <img :src="'/' + object.featuredImage.url" alt />
                  </figure>
                  <div class="flex justify-between mt-2">
                    <div>{{ object.edition }}</div>
                    <div class="text-right">
                      {{ object.project.title }}
                      <br />
                      {{ object.category.title }}
                    </div>
                  </div>
                </a>
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
        project: "",
        category: "",
        edition: ""
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
            return b.edition - a.edition;
          });

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

    let currentUrl = window.location.search
      .substring(1)
      .replace("%20", " ")
      .split("&");

    let filters = [];

    currentUrl.forEach(filter => {
      let split = filter.split("=");
      if (split.length == 2) {
        filter = {
          type: split[0],
          filter: split[1]
        };

        if (
          filter.type == "project" ||
          filter.type == "category" ||
          filter.type == "edition"
        ) {
          this.toggleFilter(filter.type, filter.filter);
        }
      }
    });
  },
  methods: {
    countObjects(project) {
      return this.objects.filter(
        object => object.project.title == project.title
      ).length;
    },
    isVisible(object) {
      let isVisible = true;

      if (
        this.filters.project != "" &&
        this.filters.project != object.project.slug
      ) {
        isVisible = false;
      }
      if (
        this.filters.category != "" &&
        this.filters.category != object.category.slug
      ) {
        isVisible = false;
      }
      if (
        this.filters.edition != "" &&
        this.filters.edition != object.edition
      ) {
        isVisible = false;
      }

      return isVisible;
    },
    toggleFilter(type, filter) {
      switch (type) {
        case "project":
          if (this.filters.project != filter) {
            this.filters.project = filter;
          } else {
            this.filters.project = "";
          }
          break;
        case "category":
          if (this.filters.category != filter) {
            this.filters.category = filter;
          } else {
            this.filters.category = "";
          }
          break;
        case "edition":
          if (this.filters.edition != filter) {
            this.filters.edition = filter;
          } else {
            this.filters.edition = "";
          }
          break;
      }
    },
    removeFilter(type) {
      switch (type) {
        case "project":
          this.filters.project = "";
          break;
        case "category":
          this.filters.category = "";
          break;
        case "edition":
          this.filters.edition = "";
          break;
      }
    }
  }
};
</script>

<style>
</style>
