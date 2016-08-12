#!/usr/bin/perl
 use CGI::Carp 'fatalsToBrowser';
 use CGI;

    my $buffer, @pairs, $pair, $name, $value, %FORM;
    my $key,$val,@args,$response;
    $ENV{'REQUEST_METHOD'} =~ tr/a-z/A-Z/;
    if ($ENV{'REQUEST_METHOD'} eq "GET")
    {
	$buffer = $ENV{'QUERY_STRING'};
    }
    # Split information into name/value pairs
    @pairs = split(/&/, $buffer);
    foreach $pair (@pairs)
    {
	($name, $value) = split(/=/, $pair);
	$value =~ tr/+/ /;
	$value =~ s/%(..)/pack("C", hex($1))/eg;
	$FORM{$name} = $value;
    }
    	$key = $FORM{"key"};
	$val = $FORM{"value"};
	if ($key eq "-q")
	{
		print "Content-type: text/xml \r\n\r\n";
		$response = `/home/spirent/Projects/RTDispCtrl/RTDispCtrl -q`;
		print "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
		print "<xml>";
		print $response;
		print "</xml>";
	}
	else
	{
		@args = ("/home/spirent/Projects/RTDispCtrl/RTDispCtrl",$key,$val);
		system(@args) == 0 or die "system @args failed: $?";
		print "Content-type: text/plain \r\n\r\n";
		print "DONE";
	}
