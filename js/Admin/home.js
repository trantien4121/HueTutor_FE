//Fetch Data Of tutor, user, blog

const userApi = `http://localhost:8080/api/v1/Users`;
const tutorApi = `http://localhost:8080/api/v1/Tutors`;
const blogApi = `http://localhost:8080/api/v1/Advertisements`;
const rateApi = `http://localhost:8080/api/v1/Rates`;

const userInfo = fetch(userApi)
    .then(response => response.json())
    .then(userData => {
       const numOfUsers = userData.length;
       document.querySelector('.num-users').innerText = numOfUsers;

       //Fetch tutor
       const tutorInfo = fetch(tutorApi)
            .then(response => response.json())
            .then(tutorData => {
                const numOfTutors = tutorData.length;
                document.querySelector('.num-tutors').innerText = numOfTutors;

                //Fetch blog
                const blogInfo = fetch(blogApi)
                    .then(response => response.json())
                    .then(blogData => {
                        const numOfBlogs = blogData.length;
                        document.querySelector('.num-blogs').innerText = numOfBlogs;

                        //Fetch rate
                        const rateInfo = fetch(rateApi)
                            .then(response => response.json())
                            .then(rateData => {
                                const numOfRates = rateData.length;
                                
                                //Draw Chart
                                var ctx2 = document.getElementById('canvas-count').getContext('2d');
                                var myChartCount = new Chart(ctx2, {
                                    type: 'bar',
                                    data: {
                                        labels: ['Tutor', 'User', 'Post', 'Comment'],
                                        datasets: [{
                                            label: 'Thống kê',
                                            data: [numOfTutors, numOfUsers, numOfBlogs, numOfRates],
                                            borderWidth: 1
                                        }]
                                    },
                                    options: {
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        }
                                    }
                                })
                                myChartCount.draw();
                            })
                    })
                    .catch(error => console.log(error));
            })
            .catch(error => console.log(error))

    })
    .catch(error => console.log(error));