<template>
  <div id="archive-app">
    <div @click="onClick" class="hidden lg:block click-to-snap fixed w-full h-screen z-50" v-if="!isSnapped"></div>

    <section class="section filter-overlay header-offset fixed top-0 lg:hidden w-full pointer-events-none z-30 bg-white">
      <div class="container blur-wrapper">
        <div class="row justify-between">
          <div class="col w-full md:w-6/12">
            <p class="filter-label">Specimen</p>
            <ul class="filter-list filter-left pointer-events-auto">
              <li v-bind:class="{ active: isActiveFilter('project', '') }" v-on:click="removeFilter('project')">All</li>
              <li v-bind:class="{ active: isActiveFilter('project', project.slug) }" v-bind:key="index" v-for="(project, index) in projects" v-on:click="toggleFilter('project', project.slug)">
                {{ project.title }}
                <div class="relative inline-block h-4" v-if="project.count">
                  <div class="absolute top-0 left-0 text-xs">{{ project.count }}</div>
                </div>
              </li>
            </ul>
          </div>

          <div class="col w-full md:w-6/12">
            <div class="row">
              <div class="col w-6/12 md:w-auto md:flex-grow">
                <p class="filter-label md:text-right">Type</p>
                <ul class="filter-list filter-right md:text-right pointer-events-auto">
                  <li v-bind:class="{ active: isActiveFilter('category', '') }" v-on:click="removeFilter('category')">All</li>
                  <li v-bind:key="index" v-for="(category, index) in categories" v-on:click="toggleFilter('category', category.slug)">
                    <span class="normal">{{ category.title }}</span>
                  </li>
                </ul>
              </div>

              <div class="col w-6/12 md:w-auto md:ml-12 md:flex-shrink">
                <p class="filter-label md:text-right">Year</p>
                <ul class="filter-list filter-right md:text-right pointer-events-auto">
                  <li v-bind:class="{ active: isActiveFilter('edition', '') }" v-on:click="removeFilter('edition')">All</li>
                  <li v-bind:key="index" v-for="(edition, index) in editions" v-on:click="toggleFilter('edition', edition.slug)">{{ edition.title }}</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section filter blur-wrapper header-offset-extra relative lg:fixed top-0 left-0 w-full pointer-events-none z-20">
      <div class="container filter-container" :class="{ opacity: !isSnapped }">
        <div class="row justify-between">
          <div class="col w-full md:w-6/12 lg:w-3/12">
            <p class="filter-label">Specimen</p>
            <ul class="filter-list filter-left pointer-events-auto">
              <li v-bind:class="{ active: isActiveFilter('project', '') }" v-on:click="removeFilter('project')">All</li>
              <li v-bind:class="{ active: isActiveFilter('project', project.slug) }" v-bind:key="index" v-for="(project, index) in projects" v-on:click="toggleFilter('project', project.slug)">
                {{ project.title }}
                <div class="relative inline-block h-4" v-if="project.count">
                  <span class="invisible text-xs">{{ project.count }}</span>
                  <span class="absolute top-0 left-0 text-xs">{{ project.count }}</span>
                </div>
              </li>
            </ul>
          </div>

          <div class="col hidden md:block md:w-6/12 lg:w-3/12 xl:w-2/12">
            <div class="row">
              <div class="col w-6/12 md:w-auto md:flex-grow">
                <p class="filter-label md:text-right">Type</p>
                <ul class="filter-list filter-right md:text-right pointer-events-auto">
                  <li v-bind:class="{ active: isActiveFilter('category', '') }" v-on:click="removeFilter('category')">All</li>
                  <li v-bind:class="{ active: isActiveFilter('category', category.slug) }" v-bind:key="index" v-for="(category, index) in categories" v-on:click="toggleFilter('category', category.slug)">{{ category.title }}</li>
                </ul>
              </div>

              <div class="col w-6/12 md:w-auto md:ml-12 lg:ml-4 md:flex-shrink">
                <p class="filter-label md:text-right">Year</p>
                <ul class="filter-list filter-right md:text-right pointer-events-auto">
                  <li v-bind:class="{ active: isActiveFilter('edition', '') }" v-on:click="removeFilter('edition')">All</li>
                  <li v-bind:class="{ active: isActiveFilter('edition', edition.slug) }" v-bind:key="index" v-for="(edition, index) in editions" v-on:click="toggleFilter('edition', edition.slug)">{{ edition.title }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="scroll-anchor w-full h-0" data-action-down="showFilterToggle" data-action-up="hideFilterToggle"></div>

    <section :class="{ loose: !isSnapped }" class="section header-offset-no-ipad blur-wrapper z-10">
      <div class="container">
        <div class="row">
          <div class="col home-list w-full lg:w-6/12 lg:ml-3/12 xl:w-8/12 xl:ml-2/12">
            <transition-group class="list row flex-wrap" name="list">
              <div class="list-item col w-full md:w-6/12 mb-12" v-bind:key="index" v-for="(object, index) in objects" v-if="isVisible(object)">
                <a :href="object.url">
                  <figure class="w-full portrait">
                    <img :src="baseUrl + '/' + object.featuredImage.url" alt />
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
import axios from 'axios'

export default {
  data() {
    return {
      isSnapped: false,
      objects: [],
      categories: [],
      projects: [],
      editions: [],
      filters: {
        project: '',
        category: '',
        edition: ''
      }
    }
  },
  mounted() {
    axios
      .get(this.baseUrl + '/objects.json')
      .then((response) => {
        if (response.status == 200) {
          let objects = response.data.data

          this.objects = objects.sort((a, b) => {
            return b.edition - a.edition
          })

          axios
            .get(this.baseUrl + '/object-categories.json')
            .then((response) => {
              if (response.status == 200) {
                this.categories = response.data.data
              }
            })
            .catch((error) => {
              console.log(error)
            })

          axios
            .get(this.baseUrl + '/project-categories.json')
            .then((response) => {
              if (response.status == 200) {
                this.projects = response.data.data

                this.projects.forEach((project) => {
                  project.count = this.countObjects(project)
                })
              }
            })
            .catch((error) => {
              console.log(error)
            })

          axios
            .get(this.baseUrl + '/editions.json')
            .then((response) => {
              if (response.status == 200) {
                this.editions = response.data.data
              }
            })
            .catch((error) => {
              console.log(error)
            })
        }
      })
      .catch((error) => {
        console.log(error)
      })

    let currentUrl = window.location.search
      .substring(1)
      .replace('%20', ' ')
      .split('&')

    let filters = []

    window.addEventListener('scroll', this.onScroll)

    currentUrl.forEach((filter) => {
      let split = filter.split('=')
      if (split.length == 2) {
        filter = {
          type: split[0],
          filter: split[1]
        }

        if (filter.type == 'project' || filter.type == 'category' || filter.type == 'edition') {
          this.toggleFilter(filter.type, filter.filter)
        }
      }
    })
  },
  methods: {
    onClick() {
      this.isSnapped = true;
    },
    onScroll() {
      console.log('scrolled!')
      window.removeEventListener('scroll', this.onScroll)
    },
    countObjects(project) {
      return this.objects.filter((object) => object.project.title == project.title).length
    },
    isVisible(object) {
      let isVisible = true

      if (this.filters.project != '' && this.filters.project != object.project.slug) {
        isVisible = false
      }
      if (this.filters.category != '' && this.filters.category != object.category.slug) {
        isVisible = false
      }
      if (this.filters.edition != '' && this.filters.edition != object.edition) {
        isVisible = false
      }

      return isVisible
    },
    toggleFilter(type, filter, element) {
      switch (type) {
        case 'project':
          if (this.filters.project != filter) {
            this.filters.project = filter
          } else {
            this.filters.project = ''
          }
          break
        case 'category':
          if (this.filters.category != filter) {
            this.filters.category = filter
          } else {
            this.filters.category = ''
          }
          break
        case 'edition':
          if (this.filters.edition != filter) {
            this.filters.edition = filter
          } else {
            this.filters.edition = ''
          }
          break
      }
    },
    removeFilter(type) {
      switch (type) {
        case 'project':
          this.filters.project = ''
          break
        case 'category':
          this.filters.category = ''
          break
        case 'edition':
          this.filters.edition = ''
          break
      }
    },
    isActiveFilter(type, filter) {
      switch (type) {
        case 'project':
          if (this.filters.project == filter) {
            return true
          }
          break
        case 'category':
          if (this.filters.category == filter) {
            return true
          }
          break
        case 'edition':
          if (this.filters.edition == filter) {
            return true
          }
          break
      }
      return false
    }
  },
  computed: {
    baseUrl() {
      if (window.location.hostname == 'localhost') {
        return 'http://localhost:8080'
      }
      return 'https://fffunction.studio/hongjie/public'
    }
  }
}
</script>

<style>
</style>
