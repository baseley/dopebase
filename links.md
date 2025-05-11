# Dopebase Framework Links

This document contains all the links that can be accessed in the browser using localhost:3000. These links are organized by plugin.

## Admin Panel

Main admin panel:
- [Admin Dashboard](http://localhost:3000/admin)

## General Pages

### Admin Pages
- [Admin Dashboard](http://localhost:3000/admin)
- [Admin Plugins](http://localhost:3000/admin/system/plugins)
- [Admin Themes](http://localhost:3000/admin/system/themes)
- [Admin Settings](http://localhost:3000/admin/system/settings)
- [Add Settings](http://localhost:3000/admin/system/settings/add)
- [Edit Profile](http://localhost:3000/admin/system/settings/profile)

### User Pages
- [Login](http://localhost:3000/login)
- [Signup](http://localhost:3000/signup)
- [Reset Password](http://localhost:3000/reset-password)
- [Home](http://localhost:3000/)


## Info

Check for edit, view, and add pages or modals for all entities. For example: add user, edit user, and view user pages or modals are available for most resources.

## Blog Plugin

Admin routes:
<!-- - [Blog Overview](http://localhost:3000/admin/plugins/blog) -->
- [Articles List](http://localhost:3000/admin/plugins/blog/articles/list)
- [Add New Article](http://localhost:3000/admin/plugins/blog/articles/add)
- [Categories List](http://localhost:3000/admin/plugins/blog/article_categories/list)
- [Add New Category](http://localhost:3000/admin/plugins/blog/article_categories/add)
- [Tags List](http://localhost:3000/admin/plugins/blog/article_tags/list)
- [Add New Tag](http://localhost:3000/admin/plugins/blog/article_tags/add)
- [AI Generator](http://localhost:3000/admin/plugins/blog/article_ideas/list)
- [Add New Article Idea](http://localhost:3000/admin/plugins/blog/article_ideas/add)
- [Categories List](http://localhost:3000/admin/plugins/blog/categories/list)
- [Add New Category](http://localhost:3000/admin/plugins/blog/categories/add)
- [Users List](http://localhost:3000/admin/plugins/blog/users/list)
- [Add New User](http://localhost:3000/admin/plugins/blog/users/add)
- [Blog Settings](http://localhost:3000/admin/plugins/blog/settings/list)


## Customer Support Plugin

Admin routes:
<!-- - [Customer Support Overview](http://localhost:3000/admin/plugins/customer-support) -->
- [Messages List](http://localhost:3000/admin/plugins/customer-support/ticket_messages/list)
- [Add New Message](http://localhost:3000/admin/plugins/customer-support/ticket_messages/add)
- [Tags List](http://localhost:3000/admin/plugins/customer-support/ticket_tags/list)
- [Add New Tag](http://localhost:3000/admin/plugins/customer-support/ticket_tags/add)
- [Ticket Threads List](http://localhost:3000/admin/plugins/customer-support/ticket_threads/list)
- [Add New Ticket Thread](http://localhost:3000/admin/plugins/customer-support/ticket_threads/add)
- [Users List](http://localhost:3000/admin/plugins/customer-support/users/list)
- [Add New User](http://localhost:3000/admin/plugins/customer-support/users/add)
- [Settings](http://localhost:3000/admin/plugins/customer-support/settings/list)

## Social Network Plugin

Admin routes:
<!-- - [Social Network Overview](http://localhost:3000/admin/plugins/social-network) -->
- [Posts List](http://localhost:3000/admin/plugins/social-network/posts/list)
- [Add New Post](http://localhost:3000/admin/plugins/social-network/posts/add)
- [Stories List](http://localhost:3000/admin/plugins/social-network/stories/list)
- [Add New Story](http://localhost:3000/admin/plugins/social-network/stories/add)
- [Users List](http://localhost:3000/admin/plugins/social-network/users/list)
- [Add New User](http://localhost:3000/admin/plugins/social-network/users/add)

## Stripe Plugin

Admin routes:
<!-- - [Stripe Overview](http://localhost:3000/admin/plugins/stripe) -->
- [Payment Methods List](http://localhost:3000/admin/plugins/stripe/payment_methods/list)
- [Add New Payment Method](http://localhost:3000/admin/plugins/stripe/payment_methods/add)
- [Users List](http://localhost:3000/admin/plugins/stripe/users/list)
- [Add New User](http://localhost:3000/admin/plugins/stripe/users/add)
- [Settings](http://localhost:3000/admin/plugins/stripe/settings/list)

## Subscriptions Plugin (SaaS)

Admin routes:
<!-- - [SaaS Overview](http://localhost:3000/admin/plugins/subscriptions) -->
- [Subscriptions List](http://localhost:3000/admin/plugins/subscriptions/subscriptions/list)
- [Add New Subscription](http://localhost:3000/admin/plugins/subscriptions/subscriptions/add)
- [Plans List](http://localhost:3000/admin/plugins/subscriptions/subscription_plans/list)
- [Add New Plan](http://localhost:3000/admin/plugins/subscriptions/subscription_plans/add)
- [Transactions List](http://localhost:3000/admin/plugins/subscriptions/transactions/list)
- [Add New Transaction](http://localhost:3000/admin/plugins/subscriptions/transactions/add)
- [Payment Methods List](http://localhost:3000/admin/plugins/subscriptions/payment_methods/list)
- [Add New Payment Method](http://localhost:3000/admin/plugins/subscriptions/payment_methods/add)


## Taxi Plugin

Admin routes:
<!-- - [Taxi Overview](http://localhost:3000/admin/plugins/taxi) -->
- [Prices & Rides List](http://localhost:3000/admin/plugins/taxi/taxi_car_categories/list)
- [Add New Price/Ride](http://localhost:3000/admin/plugins/taxi/taxi_car_categories/add)
- [Rides List](http://localhost:3000/admin/plugins/taxi/taxi_trips/list)
- [Add New Ride](http://localhost:3000/admin/plugins/taxi/taxi_trips/add)
- [Users List](http://localhost:3000/admin/plugins/taxi/users/list)
- [Add New User](http://localhost:3000/admin/plugins/taxi/users/add)


## API Endpoints

These endpoints can be accessed for API calls (not directly viewable in browser):

Blog API:
- Article Ideas List API: http://localhost:3000/api/plugins/blog/admin/article_ideas/list

Note: These are the expected routes based on the plugin structure. Some routes might require authentication or might not be fully implemented yet.
