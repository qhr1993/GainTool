#!/usr/bin/perl
 use CGI::Carp 'fatalsToBrowser';
 use CGI;
 my $mode;
 my $filename = '/tmp/statusInfo.txt';
 my $document = do {
			local $/ = undef;
			open my $fh, "< :encoding(UTF-8)", $filename
					or die "could not open $filename: $!";
			<$fh>;
		};
		print "Content-Type: text/xml; charset=utf-8\r\n\r\n";
		print "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
		print "<xml>";
		print $document;
		print "<status>";
		my @param_list = `/home/spirent/Projects/App/shm_get -m`;
		foreach (@param_list)
		{
			my @params = split(/ /,$_);
			if (@params[0] eq "-m")
			{
				$mode = @params[1];
			}
		}
		print $mode;
		print "</status>";
		print "</xml>";
