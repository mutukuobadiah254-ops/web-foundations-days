# Day 7 Assignment: Scaling a Photo-Sharing App

## 1. Overview

SnapShare is a photo-sharing application where users upload photos and scroll through feeds containing photos from people they follow.

As the application grows, its infrastructure must handle millions of users, frequent feed requests, large photo files, and background image processing.

This scaling plan describes an architecture designed to handle the expected workload while maintaining performance, reliability, and scalability.

## 2. Assumptions

The following assumptions are used for the calculations:

* SnapShare has 10,000,000 registered users.
* 10% of registered users are active each day.
* Each daily active user uploads one photo per day.
* Each daily active user views 50 feed pages per day.
* Each original photo averages 2 MB.
* Each original photo produces one thumbnail averaging 50 KB.
* A day contains 86,400 seconds.
* A year contains 365 days.
* Peak traffic is estimated at five times the average traffic.
* Storage calculations use decimal units: 1 MB = 1,000 KB, 1 GB = 1,000 MB, and 1 TB = 1,000 GB.
* Traffic averages are calculated across all 24 hours of a day.
* Every successful photo upload eventually produces one thumbnail.
* Storage estimates include original photos and thumbnails but exclude backups, replication overhead, temporary files, and other application data.
* Feed views represent feed-page requests, not individual image requests.

## 3. Traffic and Storage Calculations

### 3.1 Daily Active Users

Daily active users (DAU) are the number of distinct users who use SnapShare on a given day.

Formula:

Daily active users = Registered users × Daily active percentage

Calculation:

10,000,000 × 10% = 1,000,000

**Daily active users = 1,000,000 users.**

### 3.2 Photo Uploads Per Day

Each daily active user uploads one photo per day.

Formula:

Daily uploads = Daily active users × Uploads per user per day

Calculation:

1,000,000 × 1 = 1,000,000

**Daily uploads = 1,000,000 photos.**

### 3.3 Average and Peak Uploads Per Second

There are 86,400 seconds in a day.

Formula:

Average uploads per second = Daily uploads ÷ Seconds per day

Calculation:

1,000,000 ÷ 86,400 = 11.57

**Average uploads per second = approximately 11.57.**

Peak traffic is estimated using the required 5× multiplier.

Formula:

Peak uploads per second = Average uploads per second × 5

Calculation:

11.57 × 5 = 57.87

**Peak uploads per second = approximately 57.87.**

The system should therefore be designed to handle approximately 58 uploads per second during estimated peak periods.

### 3.4 Feed Views Per Day

Each daily active user views 50 feed pages per day.

Formula:

Daily feed views = Daily active users × Feed views per user per day

Calculation:

1,000,000 × 50 = 50,000,000

**Daily feed views = 50,000,000.**

### 3.5 Average and Peak Feed Views Per Second

Formula:

Average feed views per second = Daily feed views ÷ Seconds per day

Calculation:

50,000,000 ÷ 86,400 = 578.70

**Average feed views per second = approximately 578.70.**

Peak feed views per second:

578.70 × 5 = 2,893.52

**Peak feed views per second = approximately 2,893.52.**

The system should therefore be designed to handle approximately 2,894 feed-page requests per second during estimated peak periods.

These figures represent feed-page requests. Additional requests for image files and other resources may increase the total system traffic.

### 3.6 Daily Photo Storage

Each original photo averages 2 MB.

Daily original photo storage:

1,000,000 × 2 MB = 2,000,000 MB

2,000,000 MB ÷ 1,000 = 2,000 GB

**Daily original photo storage = 2 TB.**

Each photo also produces a thumbnail averaging 50 KB.

Convert the thumbnail size to megabytes:

50 KB ÷ 1,000 = 0.05 MB

Daily thumbnail storage:

1,000,000 × 0.05 MB = 50,000 MB

50,000 MB ÷ 1,000 = 50 GB

**Daily thumbnail storage = 50 GB.**

Total daily photo storage:

2,000 GB + 50 GB = 2,050 GB

**Total new photo storage per day = 2.05 TB.**

### 3.7 Annual Photo Storage

Annual original photo storage:

2 TB × 365 = 730 TB

Annual thumbnail storage:

50 GB × 365 = 18,250 GB

18,250 GB ÷ 1,000 = 18.25 TB

Total annual storage:

730 TB + 18.25 TB = 748.25 TB

**Total new photo storage per year = 748.25 TB, or approximately 0.75 PB.**

This is the estimated amount of new photo data generated in one year. Actual storage requirements will be higher if backups, replicated copies, additional image sizes, or other data are included.

### 3.8 Summary of Estimates

| Metric                           | Estimated value |
| -------------------------------- | --------------: |
| Registered users                 |      10,000,000 |
| Daily active users               |       1,000,000 |
| Photo uploads per day            |       1,000,000 |
| Average uploads per second       |           11.57 |
| Peak uploads per second          |           57.87 |
| Feed views per day               |      50,000,000 |
| Average feed views per second    |          578.70 |
| Peak feed views per second       |        2,893.52 |
| Original photo storage per day   |            2 TB |
| Thumbnail storage per day        |           50 GB |
| Total new photo storage per day  |         2.05 TB |
| Original photo storage per year  |          730 TB |
| Thumbnail storage per year       |        18.25 TB |
| Total new photo storage per year |       748.25 TB |

## 4. Read-Heavy or Write-Heavy?

SnapShare is a **read-heavy system** because feed views occur much more frequently than photo uploads.

The application handles approximately 579 feed-page requests per second on average, compared with approximately 12 photo uploads per second.

This means the system must efficiently serve frequent feed requests and deliver large numbers of photos without overloading its application servers or database.

To support this workload, SnapShare will use a CDN to deliver cached images, a cache to reduce repeated database queries, and a database read replica to distribute supported read operations.

The primary database will handle writes, while the read replica will handle appropriate read queries. Database replication lag must be considered when displaying recently uploaded photos or other newly updated information.

## 5. Photo Storage Strategy

SnapShare should store original photos and generated thumbnails in object storage rather than directly inside the database.

Photo files are large binary objects. Storing them directly in the database can increase database size, complicate backups and restores, consume database resources, and make storage scaling more difficult.

Object storage is designed to store large numbers of files independently of the application's database.

The database will store structured information such as:

* Photo ID.
* User ID of the photo's owner.
* Upload timestamp.
* Object-storage key for the original photo.
* Object-storage key for the thumbnail.
* Thumbnail processing status.

The original photo and thumbnail will be stored in object storage, while the database will store the metadata and references needed to locate them.

A CDN will deliver frequently requested images and thumbnails from cached locations, reducing repeated requests to the object-storage origin.

## 6. System Architecture Diagram

The following diagram shows the main components and how they interact.

```text
                         SNAPSHARE ARCHITECTURE

                                  Users
                                    |
                                    v
                                  +-----+
                                  | CDN |
                                  +-----+
                                    |
                      API requests  |  Cached image delivery
                                    |          |
                                    v          v
                             +---------------+  |
                             | Load Balancer |  |
                             +---------------+  |
                                    |           |
                                    v           |
                             +---------------+  |
                             |  App Servers  |  |
                             +---------------+  |
                               |     |     |     |
                     Cache read|     |     |     |
                               v     |     |     |
                           +-------+ |     |     |
                           | Cache | |     |     |
                           +-------+ |     |     |
                               |     |     |     |
                               v     v     |     |
                        +-------------+    |     |
                        |   Primary   |    |     |
                        |  Database   |    |     |
                        +-------------+    |     |
                               |           |     |
                       Replication         |     |
                               v           |     |
                        +-------------+    |     |
                        | Read Replica|    |     |
                        +-------------+    |     |
                                           |     |
                                   Enqueue job   |
                                           v     |
                                      +-------+  |
                                      | Queue |  |
                                      +-------+  |
                                           |     |
                                           v     |
                                   +------------------+
                                   | Thumbnail Worker |
                                   +------------------+
                                           |
                                           v
                                   +------------------+
                                   |  Object Storage  |
                                   |                  |
                                   | Original Photos  |
                                   |    Thumbnails    |
                                   +------------------+
                                           ^
                                           |
                                  Uncached image origin
                                           |
                                           +-------> CDN
```

### Architecture Notes

* API requests travel through the load balancer to the application servers.
* The CDN serves cached photos and thumbnails and retrieves uncached images from the configured object-storage origin.
* Application servers use the cache to reduce repeated database queries.
* Writes go to the primary database, while supported read queries can be served by the read replica.
* The primary database replicates changes to the read replica.
* Application servers enqueue thumbnail-generation jobs after successfully storing the original photo and its metadata.
* Thumbnail workers process queued jobs and save generated thumbnails to object storage.
* The database stores photo metadata and object-storage references rather than the image files themselves.

## 7. Component Responsibilities

**CDN:** The CDN delivers cached photos and thumbnails from locations closer to users, reducing image-loading delays and origin traffic.

**Load balancer:** The load balancer distributes incoming application requests across healthy application servers to prevent individual servers from becoming overloaded.

**App servers:** The application servers handle authentication, request validation, feed generation, photo-upload coordination, and communication with the cache, database, queue, and object storage.

**Cache:** The cache stores frequently accessed feed results and other reusable data in fast memory, reducing repeated database queries and improving response times.

**Primary database:** The primary database stores persistent structured information such as user accounts, photo metadata, ownership records, and follower relationships.

**Database read replica:** The read replica serves supported read queries using a replicated copy of the primary database's data, reducing read pressure on the primary database.

**Object storage:** Object storage holds original photos and generated thumbnails independently of the database, allowing photo storage to scale as the application grows.

**Queue:** The queue holds thumbnail-generation jobs so image processing can happen asynchronously without making users wait for every background task to finish.

**Thumbnail worker:** The thumbnail worker retrieves queued jobs, reads original photos from object storage, generates smaller images, and stores the thumbnails back in object storage.

## 8. Step-by-Step Photo Upload Flow

1. **Photo selection:** A user selects a photo in the SnapShare application and requests to upload it.

2. **Request validation:** The application server verifies authentication, permissions, supported file type, and file-size limits.

3. **Original photo upload:** The application uploads the original image to object storage and obtains its object key. A production implementation may use a time-limited presigned upload URL so the client can upload directly to object storage.

4. **Metadata creation:** The application saves the photo's ID, owner, timestamp, original object key, and initial processing status in the primary database.

5. **Job creation:** The application adds a thumbnail-generation job to the queue, containing the photo identifier and enough information for a worker to locate the original image.

6. **Upload confirmation:** Once the original image and its metadata have been stored successfully, the application confirms that the photo has been accepted. Thumbnail generation can continue in the background.

7. **Job processing:** A thumbnail worker retrieves the job from the queue and downloads or reads the original photo from object storage.

8. **Thumbnail generation:** The worker resizes the image to produce a smaller thumbnail, targeting an average size of approximately 50 KB.

9. **Thumbnail storage:** The worker uploads the generated thumbnail to object storage and updates the photo's thumbnail reference or processing status in the database.

10. **Feed delivery:** The application can include the photo in the appropriate feed, and the CDN can cache the original image or thumbnail for efficient delivery.

11. **Failure handling:** If thumbnail generation fails, the job can be retried, and the system should avoid creating duplicate results when a job is delivered more than once.

The application should distinguish between the original photo being successfully uploaded and its thumbnail being ready. This allows the upload request to finish without waiting for background image processing.

## 9. Design Trade-Offs

### 9.1 CDN Caching

**Benefit:** A CDN reduces image-loading latency and decreases the amount of traffic reaching object storage.

**Trade-off:** Cached images may remain available after an image has been changed or deleted. Cache invalidation and versioned image URLs add complexity, and CDN usage introduces additional costs.

### 9.2 Caching Application Data

**Benefit:** A cache reduces repeated database queries and improves response times for frequently accessed information.

**Trade-off:** Cached information may become stale. The application needs an invalidation or expiration strategy to keep cached data sufficiently up to date.

### 9.3 Database Read Replicas

**Benefit:** A read replica distributes supported read queries away from the primary database, helping the system handle frequent feed requests.

**Trade-off:** Replication is not always instantaneous. A user may temporarily see stale information after uploading a photo or updating a profile, and replicas introduce additional infrastructure and operational costs.

### 9.4 Asynchronous Thumbnail Generation

**Benefit:** A queue and background workers allow uploads to finish without waiting for thumbnail processing, while workers can scale independently.

**Trade-off:** Thumbnails may not be available immediately. Queues, retries, monitoring, and failure recovery add operational complexity.

## 10. Conclusion

SnapShare is expected to serve one million daily active users, process one million photo uploads per day, and handle 50 million feed-page views per day.

The average workload is approximately 12 uploads per second and 579 feed-page requests per second, with estimated peak rates of approximately 58 uploads per second and 2,894 feed-page requests per second.

Original photos and thumbnails will add approximately 748.25 TB of storage per year before accounting for backups, replication, and other overhead.

A CDN, load balancer, horizontally scalable application servers, cache, primary database, read replica, object storage, queue, and thumbnail workers provide a foundation for scaling the application.

This architecture separates image delivery, structured data, and background processing so that each part can scale according to its workload.

As real traffic grows, the team should monitor request rates, latency, cache hit rates, database performance, storage growth, and queue depth to determine when additional capacity or architectural changes are necessary.
