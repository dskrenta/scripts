#!/usr/bin/env ruby

# This is a comment

=begin
    Multiline comment
=end

puts "Hello, world!"

x = 123
puts x + 456

arr = [1, 2, 3, '4', 5]
puts arr

hash = {
    'name' => 'david',
    'age' => 20
}

puts hash

arr.each do |element|
    puts "Element: #{element}"
end


def double(x)
    x * 2
end

puts double(5)
