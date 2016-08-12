#!/usr/bin/perl -wT

use strict;
use CGI;
use CGI::Carp 'fatalsToBrowser';

use constant BUFFER_SIZE     => 4_096;
use constant IMAGE_DIRECTORY => "/tmp/img_buffer_spe";

my $q = new CGI;
my $buffer = "";

my $image = latest_file( IMAGE_DIRECTORY, '\\.(png|jpg|gif)$' );
my( $type ) = $image =~ /\.(\w+)$/;
$type eq "jpg" and $type = "jpeg";

print $q->header( -type => "image/$type", -expires => "-1d" );
binmode STDOUT;

local *IMAGE;
open IMAGE, IMAGE_DIRECTORY . "/$image" or die "Cannot open file $image: $!";
while ( read( IMAGE, $buffer, BUFFER_SIZE ) ) {
    print $buffer;
}
close IMAGE;


# Takes a path to a directory and an optional filename mask regex
# Returns the name of a random file from the directory
sub latest_file {
    my( $dir, $mask ) = @_;
    my $i = 0;
    my $file;
    local *DIR, $_;
    my @files;
    
    opendir DIR, $dir or die "Cannot open $dir: $!";
    while ( defined ( $_ = readdir DIR ) ) {
        /$mask/o or next if defined $mask;
        my $path = $dir . '/' . $_;
		next unless (-f $path);           # ignore non-files - automatically does . and ..
		push(@files, [ stat(_), $_]); # re-uses the stat results from '-f'
    }
    sub rev_by_date { $b->[9] <=> $a->[9] }
	my @sorted_files = sort rev_by_date @files;
	my @newest = @{$sorted_files[0]};
	my $name = pop(@newest);
    closedir DIR;
    return $name;
}
