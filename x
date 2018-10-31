select artists.*, count(albums.ArtistId) as artist_count from artists left join albums on (albums.ArtistId = albums.ArtistId) having artist_count > 0 order by artist.Name asc

select customers.FirstName, customers.LastName, count(customers.SupportRepId) as customer_count from employees innser join customers on employees.EmployeeId = customers.SupportRepId having customer_count = 0 